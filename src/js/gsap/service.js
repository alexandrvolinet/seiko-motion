import { gsap } from "./config.js";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initServiceSlider() {
  const slider = document.querySelector("[data-service-slider]");
  if (!slider) return () => {};

  const track = slider.querySelector(".project__slider-track");
  const prev = slider.querySelector("[data-service-prev]");
  const next = slider.querySelector("[data-service-next]");
  const current = slider.querySelector("[data-service-current]");
  const totalEl = slider.querySelector(".project__slider-total");
  if (!track) return () => {};

  const slides = Array.from(track.querySelectorAll(".project__slide"));
  const pad = (n) => String(n).padStart(2, "0");
  // Counter shows scrolls, not cards: 7 scrolls to travel 8 cards.
  // The last card still lands exactly at the end edge.
  const lastScroll = Math.max(0, slides.length - 2);
  if (totalEl) totalEl.textContent = `/ ${pad(lastScroll + 1)}`;

  const step = () => {
    const card = track.querySelector(".project__slide");
    return card ? card.getBoundingClientRect().width + 16 : 320;
  };

  const sync = () => {
    const max = track.scrollWidth - track.clientWidth;
    if (current) {
      const index = Math.min(
        lastScroll,
        Math.max(0, Math.round(track.scrollLeft / step())),
      );
      current.textContent = pad(index + 1);
    }
    if (prev) prev.disabled = track.scrollLeft <= 4;
    if (next) next.disabled = track.scrollLeft >= max - 4;
  };

  let syncQueued = false;
  const onScroll = () => {
    if (syncQueued) return;
    syncQueued = true;
    window.requestAnimationFrame(() => {
      syncQueued = false;
      sync();
    });
  };

  // Button scrolling is driven by GSAP instead of native smooth scroll:
  // native smooth + scroll-snap fight each other and the progress bar
  // stutters. Snap is parked while the tween runs.
  let scrollTween = null;
  const killScrollTween = (restoreSnap = true) => {
    if (scrollTween) {
      scrollTween.kill();
      scrollTween = null;
    }
    if (restoreSnap) track.style.scrollSnapType = "";
  };

  const go = (dir) => {
    killScrollTween(false);
    const max = track.scrollWidth - track.clientWidth;
    const target = Math.max(
      0,
      Math.min(max, track.scrollLeft + dir * step()),
    );
    track.style.scrollSnapType = "none";
    scrollTween = gsap.to(track, {
      scrollLeft: target,
      duration: 0.7,
      ease: "power3.out",
      overwrite: "auto",
      onUpdate: sync,
      onComplete: () => {
        scrollTween = null;
        track.style.scrollSnapType = "";
        sync();
      },
    });
  };
  const onPrev = () => go(-1);
  const onNext = () => go(1);

  // Buttons are the only driver: no pointer drag. Wheel only stops
  // a running tween and gives snap back.
  const takeOver = () => {
    killScrollTween(true);
    sync();
  };

  prev?.addEventListener("click", onPrev);
  next?.addEventListener("click", onNext);
  track.addEventListener("scroll", onScroll, { passive: true });
  track.addEventListener("wheel", takeOver, { passive: true });
  window.addEventListener("resize", sync);
  sync();

  return () => {
    killScrollTween(true);
    prev?.removeEventListener("click", onPrev);
    next?.removeEventListener("click", onNext);
    track.removeEventListener("scroll", onScroll);
    track.removeEventListener("wheel", takeOver);
    window.removeEventListener("resize", sync);
  };
}

// Interactive services showcase (web-development page): one controller,
// one transition language (fade + rise, expo.out), per-state ambient loops
// (transform/opacity only, killed on switch). Scroll is the only driver.
export function initWebDevShowcase() {
  const root = document.querySelector("[data-wd-showcase]");
  if (!root) return () => {};

  const items = Array.from(root.querySelectorAll("[data-wd-item]"));
  const stage = root.querySelector("[data-wd-stage]");
  const list = root.querySelector(".project__wd-list");
  const win = stage ? stage.querySelector(".wd-window") : null;
  const scenes = new Map();
  root.querySelectorAll("[data-wd-scene]").forEach((scene) => {
    scenes.set(scene.dataset.wdScene, scene);
  });
  if (!items.length || !stage) return () => {};

  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const cleanups = [];

  let activeIndex = -1;
  let currentLoop = null;
  let swapToken = 0;
  let inView = true;
  let scrollDir = "down";
  let refreshTimer = null;

  // Opening/closing items changes the list height, which shifts every
  // trigger below. Re-measure once the dust settles so reveals below
  // the showcase don't fire while still off-screen.
  const scheduleRefresh = () => {
    window.clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 400);
  };

  const resetScene = (scene) => {
    if (!scene) return;
    gsap.killTweensOf(scene);
    gsap.killTweensOf(scene.querySelectorAll("*"));
    gsap.set([scene, ...scene.querySelectorAll("*")], {
      clearProps: "all",
    });
  };

  const stopLoop = () => {
    if (currentLoop) {
      currentLoop.kill();
      currentLoop = null;
    }
  };

  const loops = {
    landing(scene) {
      const rows = scene.querySelectorAll(".wd-funnel-row");
      if (!rows.length) return null;
      gsap.set(rows, { opacity: 0.5 });
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });
      rows.forEach((row, i) => {
        tl.to(row, { opacity: 1, duration: 0.4, ease: "power2.out" }, i * 0.8);
        tl.to(row, { opacity: 0.5, duration: 0.4, ease: "power2.out" }, i * 0.8 + 0.45);
      });
      return tl;
    },
    business(scene) {
      const rows = scene.querySelectorAll(".wd-row");
      if (!rows.length) return null;
      gsap.set(rows, { opacity: 0.55 });
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });
      rows.forEach((row, i) => {
        tl.to(row, { opacity: 1, duration: 0.4, ease: "power2.out" }, i * 0.9);
        tl.to(row, { opacity: 0.55, duration: 0.4, ease: "power2.out" }, i * 0.9 + 0.5);
      });
      return tl;
    },
    ecommerce(scene) {
      const cards = scene.querySelectorAll(".wd-product");
      if (!cards.length) return null;
      const tl = gsap.timeline({ repeat: -1, defaults: { ease: "sine.inOut" } });
      cards.forEach((card, i) => {
        tl.fromTo(card, { y: 7 }, { y: -7, duration: 2.4, yoyo: true, repeat: 1 }, i * 0.35);
      });
      return tl;
    },
    react(scene) {
      const root = scene.querySelector(".wd-chip--root");
      const kids = scene.querySelectorAll(".wd-tree-kids .wd-chip");
      const all = scene.querySelectorAll(".wd-chip");
      if (!all.length) return null;
      gsap.set(all, { opacity: 0.5 });
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
      if (root) {
        tl.to(root, { opacity: 1, duration: 0.35, ease: "power2.out" }, 0);
        tl.to(root, { opacity: 0.5, duration: 0.35, ease: "power2.out" }, 0.45);
      }
      kids.forEach((chip, i) => {
        tl.to(chip, { opacity: 1, duration: 0.3, ease: "power2.out" }, 0.5 + i * 0.55);
        tl.to(chip, { opacity: 0.5, duration: 0.3, ease: "power2.out" }, 0.5 + i * 0.55 + 0.35);
      });
      return tl;
    },
    nextjs(scene) {
      const dot = scene.querySelector(".wd-flowdot");
      const nodes = scene.querySelectorAll(".wd-nodes span");
      if (!dot) return null;
      gsap.set(nodes, { opacity: 0.45 });
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
      tl.fromTo(dot, { attr: { cx: 40, cy: 110 } }, { attr: { cx: 160 }, duration: 0.9, ease: "none" }, 0);
      tl.to(dot, { attr: { cy: 40 }, duration: 0.6, ease: "none" }, 0.9);
      tl.to(dot, { attr: { cx: 280 }, duration: 0.9, ease: "none" }, 1.5);
      if (nodes.length === 3) {
        tl.to(nodes[0], { opacity: 1, duration: 0.3 }, 0);
        tl.to(nodes[1], { opacity: 1, duration: 0.3 }, 0.9);
        tl.to(nodes[2], { opacity: 1, duration: 0.3 }, 1.5);
        tl.to(nodes, { opacity: 0.45, duration: 0.4 }, 2.1);
      }
      return tl;
    },
    custom(scene) {
      const dots = scene.querySelectorAll(".wd-flowdot");
      const api = scene.querySelectorAll(".wd-nodebox")[1];
      if (!dots.length) return null;
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
      const [there, back] = dots;
      if (there) {
        tl.fromTo(there, { attr: { cx: 30 } }, { attr: { cx: 290 }, duration: 1.1, ease: "none" }, 0);
        tl.to(there, { attr: { cx: 30 }, duration: 1.1, ease: "none" }, 1.1);
      }
      if (back) {
        tl.fromTo(back, { attr: { cx: 290 } }, { attr: { cx: 30 }, duration: 1.1, ease: "none" }, 0);
        tl.to(back, { attr: { cx: 290 }, duration: 1.1, ease: "none" }, 1.1);
      }
      if (api) tl.fromTo(api, { opacity: 0.6 }, { opacity: 1, duration: 0.55, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0);
      return tl;
    },
    wordpress(scene) {
      const blocks = scene.querySelectorAll(".wd-block");
      if (!blocks.length) return null;
      gsap.set(blocks, { opacity: 0.6 });
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });
      blocks.forEach((block, i) => {
        tl.to(block, { opacity: 1, duration: 0.35, ease: "power2.out" }, i * 0.8);
        tl.to(block, { opacity: 0.6, duration: 0.35, ease: "power2.out" }, i * 0.8 + 0.45);
      });
      return tl;
    },
    performance(scene) {
      const pct = scene.querySelector("[data-wd-pct]");
      const fill = scene.querySelector(".wd-gauge-fill");
      const needle = scene.querySelector(".wd-needle");
      const check = scene.querySelector("[data-wd-check]");
      if (!pct || !fill) return null;
      const state = { v: 0 };
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.4 });
      tl.fromTo(state, { v: 0 }, { v: 100, duration: 2.2, ease: "power1.inOut", onUpdate: () => { pct.textContent = String(Math.round(state.v)); } }, 0);
      tl.fromTo(fill, { strokeDashoffset: 377 }, { strokeDashoffset: 0, duration: 2.2, ease: "power1.inOut" }, 0);
      if (needle) tl.fromTo(needle, { rotation: -90, svgOrigin: "160 105" }, { rotation: 90, duration: 2.2, ease: "power1.inOut" }, 0);
      if (check) tl.fromTo(check, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, 2.0);
      return tl;
    },
  };

  function playLoop(key) {
    stopLoop();
    if (reduceMotion || !inView) return;
    const scene = scenes.get(key);
    if (!scene) return;
    const build = loops[key];
    if (!build) return;
    currentLoop = build(scene);
    if (currentLoop && !inView) currentLoop.pause();
  }

  function activate(index, animate = true) {
    if (index === activeIndex) return;
    const token = ++swapToken;
    const nextKey = items[index].dataset.wdItem;
    const nextScene = scenes.get(nextKey);
    activeIndex = index;

    items.forEach((item, i) => {
      item.classList.toggle("is-active", i === index);
      item.setAttribute("aria-expanded", String(i === index));
    });
    scheduleRefresh();
    stopLoop();
    if (!nextScene) return;

    // Atomic swap with a quick crossfade: exactly one scene ends visible,
    // fast scrubbing can never stack half-faded scenes on top of each other.
    scenes.forEach((scene) => {
      if (scene !== nextScene && scene.classList.contains("is-active")) {
        const outToken = token;
        gsap.killTweensOf(scene);
        gsap.to(scene, {
          opacity: 0,
          duration: 0.25,
          ease: "power1.out",
          overwrite: "auto",
          onComplete: () => {
            if (token !== outToken) return;
            scene.classList.remove("is-active");
            resetScene(scene);
          },
        });
      } else if (scene !== nextScene) {
        scene.classList.remove("is-active");
        resetScene(scene);
      }
    });
    resetScene(nextScene);
    nextScene.classList.add("is-active");

    if (!animate || reduceMotion) {
      playLoop(nextKey);
      return;
    }

    gsap.fromTo(
      nextScene,
      { opacity: 0, y: scrollDir === "up" ? 18 : -18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: "expo.out",
        overwrite: "auto",
        onComplete: () => {
          if (token === swapToken) playLoop(nextKey);
        },
      },
    );
  }

  // No pin anywhere: the stage follows via CSS sticky, the active index
  // comes from live item positions. Tall items give each service a long
  // dwell, and there is no pin release that could jump.
  const range = ScrollTrigger.create({
    trigger: root,
    start: "top bottom",
    end: "bottom top",
    onUpdate: (self) => {
      const dir = self.direction === -1 ? "up" : "down";
      scrollDir = dir;
      root.dataset.dir = dir;
      // Active = the item whose own center is closest to the viewport
      // center (not the first one crossing a line) - stable with
      // mixed tall/collapsed heights, no top-edge bias.
      const center = window.innerHeight * 0.5;
      let index = 0;
      let best = Infinity;
      items.forEach((item, i) => {
        const rect = item.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height / 2 - center);
        if (dist < best) {
          best = dist;
          index = i;
        }
      });
      activate(index);
      // The sticky stage would otherwise linger over the full-width
      // sections below once its grid ends - dissolve the window as
      // the grid bottom approaches the top of the viewport.
      if (win && list) {
        const gridBottom = list.getBoundingClientRect().bottom;
        if (reduceMotion) {
          const hide = gridBottom < 140;
          win.style.opacity = hide ? "0" : "1";
          win.style.visibility = hide ? "hidden" : "visible";
        } else {
          const fade = Math.max(0, Math.min(1, (gridBottom - 100) / 400));
          win.style.opacity = fade.toFixed(3);
          win.style.visibility = fade <= 0 ? "hidden" : "visible";
        }
      }
    },
  });
  cleanups.push(() => range.kill());

  let visTrigger = null;
  if (!reduceMotion) {
    inView = ScrollTrigger.isInViewport(root);
    visTrigger = ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => {
        inView = self.isActive;
        if (inView) playLoop(items[activeIndex].dataset.wdItem);
        else if (currentLoop) currentLoop.pause();
      },
    });
    cleanups.push(() => visTrigger && visTrigger.kill());
  }

  // No initial activation: every item starts closed and opens
  // on scroll via the range trigger below.

  return () => {
    stopLoop();
    window.clearTimeout(refreshTimer);
    cleanups.forEach((fn) => fn());
  };
}

// Interactive "why choose us" cards (web-development page): hover, focus
// or tap highlights a card, others quiet down. Pure state switching -
// scroll reveals stay in projectPage.js. No loops, no ScrollTriggers here.
export function initWhyInteractive() {
  const lists = Array.from(document.querySelectorAll(".project__why"));
  if (!lists.length) return () => {};

  const finePointer =
    window.matchMedia && window.matchMedia("(pointer: fine)").matches;

  const cleanups = [];

  lists.forEach((list) => {
    const items = Array.from(list.querySelectorAll(":scope > li.wx"));
    if (!items.length) return;

    let active = list.querySelector(":scope > li.wx.is-active") || items[0];

    const setActive = (item) => {
      if (item === active) return;
      if (active) {
        active.classList.remove("is-active");
        active.setAttribute("aria-expanded", "false");
      }
      active = item;
      active.classList.add("is-active");
      active.setAttribute("aria-expanded", "true");
    };

    const on = (el, evt, fn) => {
      el.addEventListener(evt, fn);
      cleanups.push(() => el.removeEventListener(evt, fn));
    };

    items.forEach((item) => {
      on(item, "click", () => setActive(item));
      on(item, "keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setActive(item);
        }
      });
      on(item, "focus", () => setActive(item));
      if (finePointer) on(item, "mouseenter", () => setActive(item));
    });

    if (active) {
      active.classList.add("is-active");
      active.setAttribute("aria-expanded", "true");
    }
  });

  return () => {
    cleanups.forEach((fn) => fn());
  };
}
