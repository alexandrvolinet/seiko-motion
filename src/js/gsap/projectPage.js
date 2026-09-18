import { gsap } from "./config.js";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const REVEAL_SELECTOR = [
  ".project__year",
  ".project__tags",
  ".project__media",
  ".project__subtitle",
  ".project__sub",
  ".project__wd-item",
  ".project__wd-stage",
  ".project__stack",
  ".project__slider",
  ".project__more",
  ".project__more-card",
  ".project__lead",
  ".project__text",
  ".project__quote",
  ".project__fact",
  ".project__cta-line",
  ".project__cta-link",
  ".notfound__code",
  ".notfound__actions",
].join(", ");

// Entrance vocabulary per block type. Everything stays inside the site's
// motion language (power2.out, opacity + transform only); only the
// direction/shape varies so sections don't all rise identically.
function motionFor(block, shift, order) {
  const is = (sel) => block.matches(sel);
  const pos = (key) => {
    order[key] = (order[key] || 0) + 1;
    return order[key] - 1;
  };

  if (is(".project__media")) {
    return { from: { y: 60, opacity: 0 }, dur: 1, delay: 0 };
  }
  if (is(".project__wd-item")) {
    return { from: { x: -shift, y: 0, opacity: 0 }, dur: 0.9, delay: 0 };
  }
  if (is(".project__wd-stage")) {
    return { from: { scale: 0.94, y: 24, opacity: 0 }, dur: 1, delay: 0.1 };
  }
  if (is(".project__sub")) {
    const i = pos("sub");
    return {
      from: { x: i % 2 ? shift : -shift, y: 16, opacity: 0 },
      dur: 0.9,
      delay: (i % 2) * 0.08,
    };
  }
  if (is(".project__slide")) {
    const i = pos("slide");
    return {
      from: { x: shift, y: 0, opacity: 0 },
      dur: 0.9,
      delay: (i % 2) * 0.1,
    };
  }
  if (is(".project__stack")) {
    return { from: { y: 0, opacity: 0 }, dur: 0.9, delay: 0 };
  }
  if (is(".project__why li")) {
    const i = pos("why");
    return {
      from: { scale: 0.9, y: 24, opacity: 0 },
      dur: 0.8,
      delay: (i % 3) * 0.08,
    };
  }
  if (is(".project__more-card")) {
    const i = pos("more");
    return {
      from: { scale: 0.95, y: 20, opacity: 0 },
      dur: 0.8,
      delay: (i % 3) * 0.08,
    };
  }
  return { from: { y: 40, opacity: 0 }, dur: 0.9, delay: 0 };
}

export function animateProjectPage() {
  const page = document.querySelector("article.project, section.notfound");
  if (!page) return () => {};

  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return () => {};

  const blocks = Array.from(page.querySelectorAll(REVEAL_SELECTOR));
  if (!blocks.length) return () => {};

  const shift = window.innerWidth < 768 ? 32 : 56;
  const order = {};

  const ctx = gsap.context(() => {
    blocks.forEach((block) => {
      const { from, dur, delay } = motionFor(block, shift, order);

      gsap.set(block, {
        ...from,
        willChange: "transform, opacity",
      });

      ScrollTrigger.create({
        trigger: block,
        start: "top 88%",
        once: true,
        onEnter: () => {
          gsap.to(block, {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            duration: dur,
            delay,
            ease: "power2.out",
            onComplete: () =>
              gsap.set(block, {
                clearProps: "opacity,transform,translate,scale,willChange",
              }),
          });
        },
      });
    });
  }, page);

  return () => ctx.revert();
}
