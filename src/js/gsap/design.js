import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateDesign() {
  const section = document.querySelector(".design");
  if (!section) return;

  const ctx = gsap.context(() => {
    const leftCard = section.querySelector(".card:first-child");
    const gradient = section.querySelector(".card__gradient");
    const rocket = section.querySelector(".card__gradient img");
    const rightCard = section.querySelector(".card:last-child");
    const bottomBlock = section.querySelector(".card__background--transparent");

    gsap.set(leftCard, { x: -80, opacity: 0 });
    gsap.set(gradient, { clipPath: "inset(0 100% 0 0)" });
    gsap.set(rocket, { scale: 0, transformOrigin: "center center" });
    gsap.set(rightCard, { x: 80, opacity: 0 });
    gsap.set(bottomBlock, { y: 60, opacity: 0, scale: 0.95 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 90%",
        toggleActions: "play none none none"
      }
    });

    tl.to(leftCard, {
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out"
    })

    .to(gradient, {
      clipPath: "inset(0 0% 0 0)",
      duration: 1,
      ease: "power2.inOut"
    }, "-=0.4")

    .to(rocket, {
      scale: 1,
      duration: 0.8,
      ease: "back.out(1.2)"
    }, "-=0.8")

    .to(rightCard, {
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.4")

    .to(bottomBlock, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.7,
      ease: "power3.out"
    }, "-=0.3");

    return tl;
  }, section);

  return () => ctx.revert();}