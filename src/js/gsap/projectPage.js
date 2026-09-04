import { gsap } from "./config.js";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Note: .project__title and .project__slogan carry .title / .text-subtitle
// classes, so they are already revealed by page.js revealSections().
// Everything else gets its own viewport trigger here.
const REVEAL_SELECTOR = [
  ".project__year",
  ".project__tags",
  ".project__media",
  ".project__lead",
  ".project__text",
  ".project__quote",
  ".project__divider",
  ".project__fact",
  ".project__cta-line",
  ".project__cta-link",
].join(", ");

export function animateProjectPage() {
  const page = document.querySelector("article.project");
  if (!page) return () => {};

  const blocks = Array.from(page.querySelectorAll(REVEAL_SELECTOR));
  if (!blocks.length) return () => {};

  const ctx = gsap.context(() => {
    blocks.forEach((block) => {
      const isMedia = block.classList.contains("project__media");

      gsap.set(block, {
        y: isMedia ? 60 : 40,
        opacity: 0,
        willChange: "transform, opacity",
      });

      ScrollTrigger.create({
        trigger: block,
        start: "top 88%",
        once: true,
        onEnter: () => {
          gsap.to(block, {
            y: 0,
            opacity: 1,
            duration: isMedia ? 1 : 0.9,
            ease: "power2.out",
          });
        },
      });
    });
  }, page);

  return () => ctx.revert();
}
