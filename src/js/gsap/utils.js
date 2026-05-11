import { gsap } from "gsap";

export function fadeInUp(elements, trigger, options = {}) {
  const defaults = {
    y: 60,
    opacity: 0,
    duration: 0.9,
    ease: "power2.out",
    scrollTrigger: {
      trigger: trigger,
      start: "top 60%",
      toggleActions: "play none none none"
    }
  };

  const config = { ...defaults, ...options };

  return gsap.fromTo(elements, 
    { y: config.y, opacity: config.opacity },
    {
      y: 0,
      opacity: 1,
      duration: config.duration,
      ease: config.ease,
      scrollTrigger: config.scrollTrigger
    }
  );
}
