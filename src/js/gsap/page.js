import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const motion = {
  y: 60,
  duration: 0.9,
  stagger: 0.15,
  ease: "power2.out",
  start: "top 60%",
};

export function animateHeader() {
  const header = document.querySelector(".header");
  if (!header) return;

  const ctx = gsap.context(() => {
    const logo = header.querySelector(".header__logo");
    const contactBtn = header.querySelector(".btn--sm");
    const navLinks = header.querySelectorAll(".header__nav a");
    const services = header.querySelector(".header__link");

    if (!logo || !contactBtn) return;

    gsap.set([navLinks], { x: -40, opacity: 0 });
    gsap.set(services, { x: 40, opacity: 0 });

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
    });

    tl.from([logo, contactBtn], {
      y: 80,
      opacity: 0,
      duration: 0.9,
      stagger: 0.1,
    })
      .to(
        navLinks,
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
        },
        "-=0.4",
      )
      .to(
        services,
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
        },
        "<",
      );

    return tl;
  }, header);

  return () => ctx.revert();
}
export function revealSections() {
  const sections = document.querySelectorAll(".section");
  if (!sections.length) return;

  sections.forEach((section) => {
    const title = section.querySelector(".title");
    const subtitle = section.querySelector(".text-subtitle");

    if (!title) return;

    const elements = subtitle ? [title, subtitle] : [title];

    gsap.set(elements, {
      y: motion.y,
      opacity: 0,
      willChange: "transform, opacity",
    });

    gsap
      .timeline({
        defaults: {
          ease: motion.ease,
          duration: motion.duration,
        },
        scrollTrigger: {
          trigger: section,
          start: motion.start,
          toggleActions: "play none none none",
        },
      })
      .to(elements, {
        y: 0,
        opacity: 1,
        stagger: motion.stagger,
      });
  });
}

const CONFIG = {
  layers: {
    far: 50,
    mid: 35,
    near: 20,
  },

  size: {
    far: [1, 2],
    mid: [1.5, 3],
    near: [4, 8],
  },

  opacity: [0.2, 1],

  flickerDuration: [2, 6],
};

export function animateBackgroundDots(config = CONFIG) {
  const layers = {
    far: document.querySelector(".space-layer--far"),
    mid: document.querySelector(".space-layer--mid"),
    near: document.querySelector(".space-layer--near"),
  };

  const stars = [];

  const random = (min, max) => Math.random() * (max - min) + min;

  function createStars(layerName, count) {
    const layer = layers[layerName];
    const frag = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const star = document.createElement("div");
      star.className = "star";

      const sizeRange = config.size[layerName];

      const size = random(sizeRange[0], sizeRange[1]);
      const opacity = random(...config.opacity);

      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;

      const depth =
        layerName === "far" ? 0.015 : layerName === "mid" ? 0.04 : 0.08;

      star.style.width = size + "px";
      star.style.height = size + "px";

      star.style.left = x + "px";
      star.style.top = y + "px";

      star.style.setProperty("--opacity", opacity);
      star.style.opacity = opacity;

      const flicker = random(...config.flickerDuration);

      star.style.animation = `star-flicker ${flicker}s ease-in-out infinite`;

      frag.appendChild(star);

      stars.push({
        el: star,
        depth,
        offset: 0,
      });
    }

    layer.appendChild(frag);
  }

  createStars("far", config.layers.far);
  createStars("mid", config.layers.mid);
  createStars("near", config.layers.near);


  let lastScroll = window.scrollY;
  let targetScroll = lastScroll;
  let ticking = false;

  function update() {
    const delta = targetScroll - lastScroll;
    lastScroll = targetScroll;

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];

      s.offset -= delta * s.depth;

      s.el.style.transform = `translate3d(0,${s.offset}px,0)`;
    }

    ticking = false;
  }

  function onScroll() {
    targetScroll = window.scrollY;

    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
}
