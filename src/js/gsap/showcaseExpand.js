import { gsap } from "./config.js";

export function initShowcaseExpand() {
  const buttons = document.querySelectorAll(".showcase__column--stack .showcase__card--button");
  if (!buttons.length) return;

  buttons.forEach((btn, index) => {
    const expandable = btn.closest(".showcase__expandable");
    const expandEl = expandable?.querySelector(".showcase__expand");
    if (!expandEl) return;

    const expandId = expandEl.id || `showcase-expand-${index + 1}`;
    expandEl.id = expandId;
    btn.setAttribute("role", "button");
    btn.setAttribute("tabindex", "0");
    btn.setAttribute("aria-controls", expandId);
    btn.setAttribute("aria-expanded", "false");

    const toggle = () => {
      const content = expandEl.querySelector("p");
      if (!content) return;
      const isOpen = expandEl.classList.contains("is-open");
      expandEl.classList.toggle("is-open", !isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
      const height = content.scrollHeight;
      content.style.height = isOpen ? `${height}px` : "0px";
      content.style.overflow = "hidden";
      content.style.opacity = isOpen ? "" : "0";
      gsap.to(content, {
        height: isOpen ? 0 : height,
        opacity: isOpen ? 0 : 1,
        duration: 0.5,
        ease: "expo.out",
        onComplete: () => {
          content.style.height = "";
          content.style.overflow = "";
          content.style.opacity = "";
        },
      });
    };

    btn.addEventListener("click", toggle);
    btn.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggle();
      }
    });
  });
}
