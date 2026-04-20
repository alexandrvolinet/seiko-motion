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
  dotCount: 80,
  minSize: 5,
  maxSize: 7,
  minDuration: 1,
  maxDuration: 5,
  minDelay: 0,
  maxDelay: 5,
  minOpacity: 0.2,
  maxOpacity: 0.9,

  depth: {
    far: 0.02,
    mid: 0.05,
    near: 0.1,
  }
};

function random(min, max) {
  return Math.random() * (max - min) + min;
}

export function animateBackgroundDots() {
  const container = document.createElement("div");
  container.className = "space-bg";
  document.body.appendChild(container);

  const stars = [];

  for (let i = 0; i < CONFIG.dotCount; i++) {
    const dot = document.createElement("div");
    dot.className = "star";

    const size = random(CONFIG.minSize, CONFIG.maxSize);
    const x = random(0, 100);
    const y = random(0, 100);

    let depth;
    const rand = Math.random();

    if (rand < 0.33) depth = CONFIG.depth.far;
    else if (rand < 0.66) depth = CONFIG.depth.mid;
    else depth = CONFIG.depth.near;

    dot.style.cssText = `
      left: ${x}%;
      top: ${y}%;
      width: ${size}px;
      height: ${size}px;
    `;

    container.appendChild(dot);

    stars.push({
      el: dot,
      depth,
      offset: 0
    });
  }

  stars.forEach(({ el }) => {
    const duration = random(CONFIG.minDuration, CONFIG.maxDuration);
    const delay = random(CONFIG.minDelay, CONFIG.maxDelay);
    const opacity = random(CONFIG.minOpacity, CONFIG.maxOpacity);

    gsap.fromTo(
      el,
      { opacity: 0 },
      {
        opacity,
        duration,
        delay,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      }
    );
  });

  let lastScroll = window.scrollY;
  let ticking = false;

  function update() {
    const currentScroll = window.scrollY;
    const delta = currentScroll - lastScroll;

    stars.forEach((s) => {
      s.offset -= delta * s.depth;
      s.el.style.transform = `translate3d(0, ${s.offset}px, 0)`;
    });

    lastScroll = currentScroll;
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
}