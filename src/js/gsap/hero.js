import { gsap } from "gsap";

export function heroTitle() {
  const hero = document.querySelector(".home__content");
  if (!hero) return;

  const ctx = gsap.context(() => {
    const title = hero.querySelector(".title");
    const subtitle = hero.querySelector(".text-subtitle");

    const elements = subtitle ? [title, subtitle] : [title];
    if (!title) return;

    gsap.set(elements, {
      y: 60,
      opacity: 0,
      willChange: "transform, opacity"
    });

    gsap.to(elements, {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
      delay: 0.3
    });

    return elements;
  }, hero);

  return () => ctx.revert();
}

export function initHeroExpand() {
  const toggle = document.querySelector(".home__subtitle-toggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const isOpen = toggle.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen);
  });
}

export function heroCTA() {
  const hero = document.querySelector(".home__content");
  if (!hero) return;

  const ctx = gsap.context(() => {
    const btn = hero.querySelector(".home__btn");
    if (!btn) return;

    gsap.set(btn, {
      y: 60,
      opacity: 0,
      willChange: "transform, opacity"
    });

    const tl = gsap.timeline({
      delay: 0.8,
    });

    tl.to(btn, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: "power2.out"
    });
    return tl;
  }, hero);

  return () => ctx.revert();
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
