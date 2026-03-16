import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateProcessMedia() {
  const section = document.querySelector(".process");
  if (!section) return;

  const ctx = gsap.context(() => {
    const media = section.querySelector(".process__media");

    gsap.set(media, {
      y: 80,
      scale: 0.7,
      opacity: 0,
      transformOrigin: "center center",
      willChange: "transform, opacity"
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        toggleActions: "play none none none"
      }
    });

    tl.to(media, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "power2.out"
    });

    return tl;
  }, section);

  return () => ctx.revert();
}
