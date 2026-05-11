import { gsap } from "./config.js";



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
  dotCount: 32,
  minSize: 3,
  maxSize: 5,
  minDuration: 5,
  maxDuration: 12,
  minOpacity: 0.35,
  maxOpacity: 0.95,
  minDistance: 1,
  maxDistance: 100,
  respawnMinDelay: 0.25,
  respawnMaxDelay: 1.4,
  glowBlurMin: 0,
  glowBlurMax: 2
};

function random(min, max) {
  return Math.random() * (max - min) + min;
}

export function animateBackgroundDots() {
  const container = document.querySelector(".space-bg") || document.createElement("div");

  if (!container.parentNode) {
    container.className = "space-bg";
    document.body.appendChild(container);
  }

  container.replaceChildren();

  const spawnDot = () => {
    const dot = document.createElement("div");
    dot.className = "star";

    const size = random(CONFIG.minSize, CONFIG.maxSize);
    const startX = random(0, window.innerWidth);
    const startY = random(0, window.innerHeight);
    const angle = random(0, Math.PI * 2);
    const distance = random(CONFIG.minDistance, CONFIG.maxDistance);
    const duration = random(CONFIG.minDuration, CONFIG.maxDuration);
    const opacity = random(CONFIG.minOpacity, CONFIG.maxOpacity);
    const blur = random(CONFIG.glowBlurMin, CONFIG.glowBlurMax);
    const driftX = Math.cos(angle) * distance;
    const driftY = Math.sin(angle) * distance;

    dot.style.left = `${startX}px`;
    dot.style.top = `${startY}px`;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.setProperty("--star-opacity", opacity.toFixed(2));
    dot.style.setProperty("--star-blur", `${blur.toFixed(0)}px`);

    container.appendChild(dot);

    gsap.timeline({
      onComplete: () => {
        dot.remove();
        gsap.delayedCall(
          random(CONFIG.respawnMinDelay, CONFIG.respawnMaxDelay),
          spawnDot
        );
      }
    })
    .fromTo(
      dot,
      {
        x: 0,
        y: 0,
        opacity: 0,
        scale: 0.65
      },
      {
        x: driftX * 0.35,
        y: driftY * 0.35,
        opacity,
        scale: 1,
        duration: duration * 0.35,
        ease: "sine.out"
      }
    )
    .to(dot, {
      x: driftX,
      y: driftY,
      opacity: 0,
      scale: random(0.85, 1.2),
      duration: duration * 0.65,
      ease: "sine.in"
    });
  };

  for (let i = 0; i < CONFIG.dotCount; i++) {
    gsap.delayedCall(
      random(0, CONFIG.maxDuration * 0.4),
      spawnDot
    );
  }
}
