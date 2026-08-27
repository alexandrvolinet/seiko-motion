import { gsap } from "./config.js";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initProjectCards() {
  const toggles = document.querySelectorAll(".project-card__toggle");
  if (!toggles.length) return;

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const card = toggle.closest(".project-card");
      if (!card) return;

      const detailsId = toggle.getAttribute("aria-controls");
      const details = card.querySelector(`.project-card__details[id="${detailsId}"]`);
      if (!details) return;

      const isOpen = details.classList.contains("is-open");

      if (isOpen) {
        details.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        details.setAttribute("aria-hidden", "true");
      } else {
        details.classList.add("is-open");
        toggle.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
        details.setAttribute("aria-hidden", "false");
      }
    });
  });
}

export function animateProjectCards() {
  const grid = document.querySelector(".projects__grid");
  const cards = grid ? Array.from(grid.querySelectorAll(".project-card")) : [];
  if (!cards.length) return;

  const isStacked = window.matchMedia("(max-width: 991px)").matches;

  if (isStacked) {
    cards.forEach((card, index) => {
      ScrollTrigger.create({
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none none",
        once: true,
        onEnter: () => {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            delay: index * 0.15,
          });
        },
      });
    });
  } else {
    ScrollTrigger.create({
      trigger: grid,
      start: "top 75%",
      toggleActions: "play none none none",
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          stagger: 0.15,
        });
      },
    });
  }
}