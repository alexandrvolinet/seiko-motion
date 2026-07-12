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

  const mm = gsap.matchMedia();
  const ctx = gsap.context(() => {
    mm.add({ all: "all", stacked: "(max-width: 991px)" }, (mediaContext) => {
      prepareCounters(counters);

      const start = mediaContext.conditions.stacked ? "top 82%" : "top 60%";

      gsap.set(cards, {
        y: 60,
        opacity: 0,
        willChange: "transform, opacity",
      });

      const animations = [];

      if (mediaContext.conditions.stacked) {
        cards.forEach((card) => {
          animations.push(
            gsap.to(card, {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start,
                toggleActions: "play none none none",
                onEnter: () =>
                  startCounters(card.querySelectorAll(".stats__num")),
              },
            })
          );
        });
      } else {
        const desktopAnim = gsap.to(cards, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: section,
            start,
            toggleActions: "play none none none",
            onEnter: () => startCounters(counters),
          },
        });
        animations.push(desktopAnim);
      }

      return () => {
        animations.forEach(killAnimation);
      };
    });
  }, section);

  return () => {
    mm.revert();
    ctx.revert();
  };
}
