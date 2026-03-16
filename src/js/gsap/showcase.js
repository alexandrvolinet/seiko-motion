import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function showcaseUp() {
  const groups = document.querySelectorAll(".showcase");
  if (!groups.length) return;

  const ctx = gsap.context(() => {
    groups.forEach(group => {
      const items = group.querySelectorAll(".showcaseUp");
      if (!items.length) return;

      gsap.set(items, {
        y: 60,
        opacity: 0
      });

      gsap.to(items, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: group,
          start: "top 60%",
          toggleActions: "play none none none"
        }
      });
    });
  });

  return () => ctx.revert();
}
