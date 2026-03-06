import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateStats() {
  const section = document.querySelector("#stats");
  if (!section) return;

  const first = section.querySelector(".stats__card--first");
  const second = section.querySelector(".stats__card--second");
  const third = section.querySelector(".stats__card--third");

  const counters = section.querySelectorAll(".stats__card span:first-child");

  counters.forEach((el) => {
    const text = el.textContent.trim();
    const value = parseInt(text.replace(/\D/g, ""));
    const suffix = text.replace(/[0-9]/g, "");
    el.dataset.target = value;
    el.dataset.suffix = suffix;
    el.textContent = "0" + suffix;
  });

  gsap.set(first, { x: 120 });
  gsap.set(third, { x: -120 });

  gsap.set(second, {
    scale: 0,
    opacity: 0,
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 30%",
      toggleActions: "play none none none",
    },
  });

  tl.to([first, third], {
    x: 0,
    duration: 0.9,
    ease: "power3.out",
  })

    .to(
      second,
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.6)",
      },
      "-=0.4",
    )

    .add(() => startCounters(counters));
}

function startCounters(elements) {
  elements.forEach((el) => {
    const value = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix;

    const counter = { val: 0 };

    gsap.to(counter, {
      val: value,
      duration: 2,
      ease: "power1.out",
      onUpdate() {
        el.textContent = Math.floor(counter.val) + suffix;
      },
    });
  });
}
