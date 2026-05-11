import { gsap } from "./config.js";

function prepareCounters(elements) {
  elements.forEach((element) => {
    if (!element.dataset.target) {
      const text = element.textContent.trim();
      const value = parseInt(text.replace(/\D/g, ""), 10);
      const suffix = text.replace(/[0-9]/g, "");

      element.dataset.target = value;
      element.dataset.suffix = suffix;
    }

    element.textContent = `0${element.dataset.suffix}`;
    delete element.dataset.counterStarted;
  });
}

function startCounters(elements) {
  elements.forEach((element) => {
    if (element.dataset.counterStarted === "true") return;

    element.dataset.counterStarted = "true";

    const value = parseInt(element.dataset.target, 10);
    const suffix = element.dataset.suffix;
    const counter = { value: 0 };

    gsap.to(counter, {
      value,
      duration: 2,
      ease: "power1.out",
      onUpdate() {
        element.textContent = `${Math.floor(counter.value)}${suffix}`;
      }
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

  const first = section.querySelector(".stats__card--first");
  const second = section.querySelector(".stats__card--second");
  const third = section.querySelector(".stats__card--third");
  const cards = [first, second, third].filter(Boolean);
  const counters = Array.from(
    section.querySelectorAll(".stats__card span:first-child")
  );

  if (!cards.length || !counters.length) return;

  const mm = gsap.matchMedia();
  const ctx = gsap.context(() => {
    mm.add({ all: "all", stacked: "(max-width: 991px)" }, (mediaContext) => {
      prepareCounters(counters);

      if (mediaContext.conditions.stacked) {
        gsap.set(cards, {
          y: 60,
          opacity: 0,
          willChange: "transform, opacity"
        });

        const animations = cards.map((card) =>
          gsap.to(card, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 82%",
              toggleActions: "play none none none",
              onEnter: () =>
                startCounters(card.querySelectorAll("span:first-child"))
            }
          })
        );

        return () => {
          animations.forEach(killAnimation);
        };
      }

      gsap.set(first, { x: 120 });
      gsap.set(third, { x: -120 });
      gsap.set(second, {
        scale: 0,
        opacity: 0
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          toggleActions: "play none none none"
        }
      });

      timeline
        .to([first, third], {
          x: 0,
          duration: 0.9,
          ease: "power3.out"
        })
        .to(
          second,
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "power1.inOut"
          },
          "-=0.4"
        )
        .add(() => startCounters(counters));

      return () => {
        killAnimation(timeline);
      };
    });
  }, section);

  return () => {
    mm.revert();
    ctx.revert();
  };
}
