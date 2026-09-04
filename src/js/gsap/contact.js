import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateContactCards() {
  const section = document.querySelector(".contact-us");
  if (!section) return;

  const ctx = gsap.context(() => {
    const cards = section.querySelectorAll(".contact-us__card");

    if (!cards.length) return;

    cards.forEach((card, i) => {
      const xFrom = card.classList.contains("contact-us__card--contacts")
        ? 120
        : card.classList.contains("contact-us__card--info")
          ? -120
          : 0;

      const yFrom = card.classList.contains("contact-us__card--video")
        ? 120
        : 0;

      gsap.set(card, {
        x: xFrom,
        y: yFrom,
        opacity: 0,
        willChange: "transform, opacity",
      });

      gsap.to(card, {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 0.5,
        delay: i * 0.1,
        ease: "power2.out",
        onComplete: () => gsap.set(card, { clearProps: "willChange" }),
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    });
  }, section);

  return () => ctx.revert();
}
