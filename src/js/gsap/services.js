import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateServices() {
  const section = document.querySelector(".services");
  if (!section) return;

  const ctx = gsap.context(() => {
    const topCards = section.querySelectorAll(".card--one, .card--two");
    const bottomCards = section.querySelectorAll(".card--three, .card--four");
    const center = section.querySelector(".services__center");

    gsap.set([topCards, bottomCards, center], {
      y: 60,
      opacity: 0,
      scale: 0.95
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 60%",
        toggleActions: "play none none none"
      }
    });

    tl.to(topCards, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      scale: 1,
      ease: "power3.out"
    })

    .to(center, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.4")

    .to(bottomCards, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.5");

    return tl;
  }, section);

  return () => ctx.revert();
}
