import { gsap } from "./config.js";

export function initBreadcrumbs() {
  const navs = document.querySelectorAll(".breadcrumbs");
  if (!navs.length) return () => {};

  const cleanups = [];

  navs.forEach((nav) => {
    const items = Array.from(nav.querySelectorAll("li"));
    if (!items.length) return;

    const ctx = gsap.context(() => {
      gsap.set(items, {
        x: -24,
        opacity: 0,
        willChange: "transform, opacity",
      });

      gsap.to(items, {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.18,
        onComplete: () => gsap.set(items, { clearProps: "willChange" }),
      });
    }, nav);

    cleanups.push(() => ctx.revert());
  });

  return () => cleanups.forEach((fn) => fn());
}
