import { gsap } from "gsap";

export function animateServicesV2() {
  const section = document.querySelector(".services-v2");
  if (!section) return;

  const ctx = gsap.context(() => {
    // Placeholder for future servicesV2 animations.
  }, section);

  return () => ctx.revert();
}
