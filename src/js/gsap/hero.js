import { gsap } from "gsap";
import { animateTextReveal } from "./responsiveReveal.js";

export function heroTitle() {
  const hero = document.querySelector(".home__content");
  if (!hero) return;

  const title = hero.querySelector(".title");
  const subtitle = hero.querySelector(".text-subtitle");

  return animateTextReveal(title && subtitle ? [title, subtitle] : [title], {
    scope: hero,
    y: 60,
    duration: 1,
    ease: "power2.out",
    stagger: 0.2,
    delay: 0.2,
  });
}

export function initHeroExpand() {
  const toggle = document.querySelector(".home__subtitle-toggle");
  const expand = document.querySelector(".home__subtitle-expand");
  if (!toggle || !expand) return;

  const label = toggle.firstElementChild;
  const collapsedLabel = "Show more";
  const expandedLabel = "Show less";

  const syncToggleState = (isOpen) => {
    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    expand.setAttribute("aria-hidden", String(!isOpen));

    if (label) {
      label.textContent = isOpen ? expandedLabel : collapsedLabel;
    }
  };

  syncToggleState(false);

  toggle.addEventListener("click", () => {
    syncToggleState(!toggle.classList.contains("is-open"));
  });
}

export function heroCTA() {
  const hero = document.querySelector(".home__content");
  if (!hero) return;

  const btn = hero.querySelector(".home__btn");
  if (!btn) return;

  return animateTextReveal([btn], {
    scope: hero,
    y: 28,
    duration: 0.95,
    ease: "power2.out",
    delay: 0.55,
  });
}

export function arc() {
  const arcTop = document.querySelector(".arcTop");
  const arcBottom = document.querySelector(".arcBottom");

  if (!arcTop || !arcBottom) return;

  gsap.set([arcTop, arcBottom], {
    scale: 0.5,
    transformOrigin: "top center"
  });

  const tl = gsap.timeline({
    delay: 0.8,
    defaults: { ease: "power2.out" }
  });

  tl.fromTo(arcTop, 
    {
      scale: 0,
      y: 50
    },
    {
      scale: 1,
      y: 0,
      duration: 2
    },
    0 
  );

  tl.fromTo(arcBottom, 
    {
      scale: 0.5,
      opacity: 0,
      y: 50
    },
    {
      scale: 1,
      opacity: 1,
      y: 0,
      duration: 2
    },
    0
  );

  return tl;
}
