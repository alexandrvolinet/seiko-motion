import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const motion = {
  y: 60,
  duration: 0.9,
  stagger: 0.15,
  ease: "power2.out",
  start: "top 80%"
};
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
export function revealSections() {
  const sections = document.querySelectorAll(".section");
  if (!sections.length) return;

  sections.forEach(section => {
    const title = section.querySelector(".title");
    const subtitle = section.querySelector(".text-subtitle");

    if (!title) return;

    const elements = subtitle
      ? [title, subtitle]
      : [title];

    gsap.set(elements, {
      y: motion.y,
      opacity: 0,
      willChange: "transform, opacity"
    });

    gsap.timeline({
      defaults: {
        ease: motion.ease,
        duration: motion.duration
      },
      scrollTrigger: {
        trigger: section,
        start: motion.start,
        toggleActions: "play none none none"
      }
    })
    .to(elements, {
      y: 0,
      opacity: 1,
      stagger: motion.stagger
    });
  });
}