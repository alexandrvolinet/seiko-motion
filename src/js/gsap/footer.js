import { gsap } from "./config.js";
import { createResponsiveReveal } from "./responsiveReveal.js";

export function animateFooter() {
  const footer = document.querySelector(".footer");
  if (!footer) return;

  const elements = [
    footer.querySelector(".footer__logo"),
    footer.querySelector(".footer__credentials"),
    footer.querySelector(".footer__socials"),
    footer.querySelector(".footer__email")
  ].filter(Boolean);

  if (!elements.length) return;

  const cleanups = [];
  const ctx = gsap.context(() => {
    cleanups.push(
      createResponsiveReveal({
        scope: footer,
        items: elements,
        stackQuery: "(max-width: 1280px)",
        desktopStart: "top 80%",
        stackedStart: "top 85%"
      })
    );
  }, footer);

  return () => {
    cleanups.forEach((cleanup) => cleanup?.());
    ctx.revert();
  };
}
