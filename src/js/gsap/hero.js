import { gsap } from "gsap";


export function animateHeader() {
  const header = document.querySelector(".header");
  if (!header) return;

  const ctx = gsap.context(() => {
    const logo = header.querySelector(".header__logo");
    const contactBtn = header.querySelector(".btn--sm");
    const navLinks = header.querySelectorAll(".header__nav a");
    const services = header.querySelector(".header__link");

    if (!logo || !contactBtn) return;

    gsap.set([navLinks], { x: -40, opacity: 0 });
    gsap.set(services, { x: 40, opacity: 0 });

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" }
    });

    tl.from([logo, contactBtn], {
      y: 80,
      opacity: 0,
      duration: 0.9,
      stagger: 0.1
    })
      .to(
        navLinks,
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08
        },
        "-=0.4"
      )
      .to(
        services,
        {
          x: 0,
          opacity: 1,
          duration: 0.6
        },
        "<"
      );

    return tl;
  }, header);

  return () => ctx.revert();
}

export function heroCTA() {
  const hero = document.querySelector(".home__content");
  if (!hero) return;

  const ctx = gsap.context(() => {
    const btn = hero.querySelector("button");
    if (!btn) return;

    gsap.set(btn, {
      y: 60,
      opacity: 0,
      willChange: "transform, opacity"
    });

    const tl = gsap.timeline({
      delay: 0.4,
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
