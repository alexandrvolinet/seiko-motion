import { gsap } from "gsap";

export function animateProcessMedia() {
  const section = document.querySelector(".process");
  const media = section.querySelector(".process__media");

  gsap.set(media, {
    y: 80,
    scale: 0.7,
    opacity: 0,
    transformOrigin: "center center",
    willChange: "transform, opacity"
  });

  gsap.timeline({
    scrollTrigger: {
      trigger: media,
      start: "top 85%",
      end: "top 70%",
      scrub: 1, 
      once: true
    }
  })
  .to(media, {
    y: 0,
    opacity: 1,
    ease: "none"
  })
  .to(media, {
    scale: 1,
    ease: "none"
  });
}