import { gsap } from "./config.js";

export function animateDesign() {
  const section = document.querySelector(".design");
  if (!section) return;

  const ctx = gsap.context(() => {
    const leftCard = section.querySelector(".card:first-child");
    const gradient = section.querySelector(".card__gradient");
    const rocket = section.querySelector(".card__gradient img");
    const rightCard = section.querySelector(".card:last-child");
    const bottomBlock = section.querySelector(".card__background--transparent");

    gsap.set(leftCard, { y: 60, opacity: 0 });
    gsap.set(gradient, { y: 60, opacity: 0 });
    gsap.set(rocket, { scale: 0.85, opacity: 0, transformOrigin: "center center" });
    gsap.set(rightCard, { y: 60, opacity: 0 });
    gsap.set(bottomBlock, { y: 60, opacity: 0, scale: 0.95 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });

    tl.to(leftCard, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out"
    })

    .to(gradient, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.4")

    .to(rocket, {
      scale: 1,
      opacity: 1,
      duration: 0.8,
      ease: "back.out(1.2)"
    }, "-=0.6")

    .to(rightCard, {
      y: 0,
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