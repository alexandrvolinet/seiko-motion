import { gsap } from "./config.js";

export const TEXT_REVEAL = {
  y: 28,
  duration: 0.9,
  ease: "power2.out",
};

export function animateTextReveal(targets, options = {}) {
  const elements = Array.from(targets).filter(Boolean);
  if (!elements.length) return () => {};

  const {
    scope = document.body,
    y = TEXT_REVEAL.y,
    duration = TEXT_REVEAL.duration,
    ease = TEXT_REVEAL.ease,
    stagger = 0,
    delay = 0,
    scrollTrigger,
  } = options;

  const ctx = gsap.context(() => {
    gsap.set(elements, {
      y,
      opacity: 0,
      willChange: "transform, opacity",
    });

    const tween = gsap.to(elements, {
      y: 0,
      opacity: 1,
      duration,
      ease,
      stagger,
      delay,
      scrollTrigger,
    });

    return tween;
  }, scope);

  return () => ctx.revert();
}

function killAnimation(animation) {
  animation?.scrollTrigger?.kill();
  animation?.kill();
}

export function createResponsiveReveal({
  scope,
  items,
  stackQuery = "(max-width: 991px)",
  desktopTrigger = scope,
  desktopStart = "top 60%",
  stackedStart = "top 80%",
  set = {
    y: TEXT_REVEAL.y,
    opacity: 0,
    willChange: "transform, opacity"
  },
  to = {
    y: 0,
    opacity: 1,
    duration: TEXT_REVEAL.duration,
    ease: TEXT_REVEAL.ease
  },
  desktopStagger = 0.2
}) {
  const targets = Array.from(items).filter(Boolean);

  if (!scope || !targets.length) {
    return () => {};
  }

  const mm = gsap.matchMedia();

  mm.add({ all: "all", stacked: stackQuery }, (context) => {
    const isStacked = context.conditions.stacked;

    gsap.set(targets, set);

    if (isStacked) {
      const animations = targets.map((item) =>
        gsap.to(item, {
          ...to,
          scrollTrigger: {
            trigger: item,
            start: stackedStart,
            toggleActions: "play none none none"
          }
        })
      );

      return () => {
        animations.forEach(killAnimation);
      };
    }

    const animation = gsap.to(targets, {
      ...to,
      stagger: desktopStagger,
      scrollTrigger: {
        trigger: desktopTrigger,
        start: desktopStart,
        toggleActions: "play none none none"
      }
    });

    return () => {
      killAnimation(animation);
    };
  });

  return () => {
    mm.revert();
  };
}
