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

      const expand = expandable.querySelector(".showcase__expand");
      if (!expand) return;

      expand.classList.toggle("is-open");
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
