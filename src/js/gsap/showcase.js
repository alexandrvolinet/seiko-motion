import { gsap } from "./config.js";
import { createResponsiveReveal } from "./responsiveReveal.js";

export function initShowcaseExpand() {
  const buttons = document.querySelectorAll(
    ".showcase__column--stack .showcase__card--button"
  );
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const expandable = btn.closest(".showcase__expandable");
      if (!expandable) return;

      const expandEl = expandable.querySelector(".showcase__expand");
      if (!expandEl) return;

      const content = expandEl.querySelector("p");
      if (!content) return;

      const isOpen = expandEl.classList.contains("is-open");

      if (isOpen) {
        expandEl.classList.remove("is-open");
        const h = content.scrollHeight;
        content.style.height = h + "px";
        content.style.overflow = "hidden";
        gsap.to(content, {
          height: 0,
          opacity: 0,
          duration: 0.5,
          ease: "expo.out",
          onComplete: () => {
            content.style.height = "";
            content.style.overflow = "";
            content.style.opacity = "";
          }
        });
      } else {
        expandEl.classList.add("is-open");
        const h = content.scrollHeight;
        content.style.height = "0px";
        content.style.overflow = "hidden";
        content.style.opacity = "0";
        gsap.to(content, {
          height: h,
          opacity: 1,
          duration: 0.5,
          ease: "expo.out",
          onComplete: () => {
            content.style.height = "";
            content.style.overflow = "";
          }
        });
      }
    });
  });
}

export function showcaseUp() {
  const groups = document.querySelectorAll(".showcase");
  if (!groups.length) return;

  const cleanups = [];
  const ctx = gsap.context(() => {
    groups.forEach((group) => {
      const items = group.querySelectorAll(".showcaseUp");
      if (!items.length) return;

      cleanups.push(
        createResponsiveReveal({
          scope: group,
          items,
          stackQuery: "(max-width: 991px)",
          desktopStart: "top 60%",
          stackedStart: "top 80%"
        })
      );
    });
  }, document.body);

  return () => {
    cleanups.forEach((cleanup) => cleanup?.());
    ctx.revert();
  };
}
