import { gsap } from "./config.js";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createResponsiveReveal } from "./responsiveReveal.js";
import { initVideoAutoplay } from "./videoAutoplay.js";

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
  // Initialize video autoplay with viewport detection
  // (runs for project cards and standalone project pages)
  initVideoAutoplay();

  const grid = document.querySelector(".projects__grid");
  const cards = grid
    ? Array.from(grid.querySelectorAll(".project-card"))
    : [];

  if (!cards.length) return;

  gsap.set(cards, {
    opacity: 0,
    y: 50,
  });

  cards.forEach((card) => {
    const toggle = card.querySelector(".project-card__toggle");

    ScrollTrigger.create({
      trigger: card,
      start: "top 85%",
      once: true,

      onEnter: () => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
        });

        if (toggle) {
          gsap.to(toggle, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            delay: 0.3,
          });
        }
      },
    });
  });

  // Animate "View all projects" button
  const viewAllBtn = document.querySelector(".projects__view-all");
  if (viewAllBtn) {
    createResponsiveReveal({
      scope: viewAllBtn,
      items: [viewAllBtn],
      stackedStart: "top 90%",
      desktopStart: "top 85%",
    });
  }
}

export function animateProjectsToolbar() {
  const toolbar = document.querySelector(".projects__toolbar");
  if (!toolbar) return () => {};

  const items = Array.from(
    toolbar.querySelectorAll(
      ".projects__filter, .projects__reset, .projects__count"
    )
  );
  if (!items.length) return () => {};

  return createResponsiveReveal({
    scope: toolbar,
    items,
    desktopTrigger: toolbar,
    desktopStart: "top 85%",
    stackedStart: "top 90%",
    desktopStagger: 0.12,
  });
}