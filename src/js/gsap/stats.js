import { gsap } from "./config.js";

function isCounterElement(el) {
  return !isNaN(parseInt(el.dataset.target, 10));
}

function prepareCounters(elements) {
  elements.forEach((element) => {
    if (!element.dataset.target) {
      const text = element.textContent.trim();
      const value = parseInt(text.replace(/\D/g, ""), 10);
      const suffix = text.replace(/[0-9]/g, "");

      element.dataset.target = value;
      element.dataset.suffix = suffix;
    }

    if (isCounterElement(element)) {
      element.textContent = `0${element.dataset.suffix}`;
    }
    delete element.dataset.counterStarted;
  });
}

function startCounters(elements) {
  elements.forEach((element) => {
    if (element.dataset.counterStarted === "true") return;
    const value = parseInt(element.dataset.target, 10);
    if (isNaN(value)) return;

    element.dataset.counterStarted = "true";
    const suffix = element.dataset.suffix;
    const counter = { value: 0 };

    gsap.to(counter, {
      value,
      duration: 2,
      ease: "power1.out",
      onUpdate() {
        element.textContent = `${Math.floor(counter.value)}${suffix}`;
      },
    });
  });
}

function killAnimation(animation) {
  animation?.scrollTrigger?.kill();
  animation?.kill();
}

export function animateStats() {
  const section = document.querySelector("#stats");
  if (!section) return;

  const cards = Array.from(section.querySelectorAll(".stats__card"));
  const counters = Array.from(
    section.querySelectorAll(".stats__card .stats__num")
  );

  if (!cards.length || !counters.length) return;

  const ctx = gsap.context(() => {
    prepareCounters(counters);

    const isStacked = window.matchMedia("(max-width: 991px)").matches;
    const start = isStacked ? "top 82%" : "top 60%";

    gsap.set(cards, {
      y: 50,
      opacity: 0,
      willChange: "transform, opacity",
    });

    const animations = [];

    if (isStacked) {
      cards.forEach((card) => {
        animations.push(
          gsap.to(card, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start,
              toggleActions: "play none none none",
              onEnter: () =>
                startCounters(card.querySelectorAll(".stats__num")),
            },
            onComplete: () => gsap.set(card, { clearProps: "willChange" }),
          })
        );
      });
    } else {
      animations.push(
        gsap.to(cards, {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: section,
            start,
            toggleActions: "play none none none",
            onEnter: () => startCounters(counters),
          },
          onComplete: () => gsap.set(cards, { clearProps: "willChange" }),
        })
      );
    }

    return () => {
      animations.forEach(killAnimation);
    };
  }, section);

  return () => {
    ctx.revert();
  };
}
