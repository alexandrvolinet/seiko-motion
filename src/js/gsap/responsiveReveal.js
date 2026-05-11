import { gsap } from "./config.js";

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
    y: 60,
    opacity: 0,
    willChange: "transform, opacity"
  },
  to = {
    y: 0,
    opacity: 1,
    duration: 0.9,
    ease: "power2.out"
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
