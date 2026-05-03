import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateServicesV2() {
  const section = document.querySelector(".services-v2");
  if (!section) return;

  const progress = section.querySelector(".services-v2__header");
  const progressValue = section.querySelector(".services-v2__progress-value");
  const items = Array.from(section.querySelectorAll(".services-v2__item"));

  if (!progress || !progressValue || !items.length) return;

  const mm = gsap.matchMedia();
  const ctx = gsap.context(() => {
    mm.add(
      {
        horizontal: "(min-width: 1281px)",
        vertical: "(max-width: 1280px)"
      },
      (mediaContext) => {
        const isVertical = mediaContext.conditions.vertical;
        const progressAxis = isVertical ? "scaleY" : "scaleX";
        const progressOrigin = isVertical ? "center top" : "left center";
        const cards = items.map((item) => item.querySelector(".card"));
        const connectors = items.map((item) =>
          item.querySelector(".services-v2__connector")
        );
        const labels = items.map((item) => item.querySelector(".services-v2__label"));

        gsap.set(progressValue, {
          scaleX: isVertical ? 1 : 0,
          scaleY: isVertical ? 0 : 1,
          transformOrigin: progressOrigin,
          willChange: "transform"
        });

        gsap.set(connectors, {
          opacity: 0,
          y: 20,
          willChange: "transform, opacity"
        });

        gsap.set(cards, {
          opacity: 0,
          y: 40,
          willChange: "transform, opacity"
        });

        gsap.set(labels, {
          opacity: 0,
          y: 20,
          willChange: "transform, opacity"
        });

        const tl = gsap.timeline({
          defaults: {
            ease: "power2.out"
          },
          scrollTrigger: {
            trigger: progress,
            start: "top 25%",
            toggleActions: "play none none none"
          }
        });

        tl.to(
          progressValue,
          {
            [progressAxis]: 1,
            duration: 1.2,
            ease: "power2.out"
          },
          0
        );

        items.forEach((item, index) => {
          const markerStart = 0.16 + index * 0.24;
          const markerPop = markerStart + 0.08;
          const connectorStart = markerStart + 0.05;
          const labelStart = markerStart + 0.08;
          const cardStart = markerStart + 0.12;

          tl.to(
            item,
            {
              "--services-v2-marker-opacity": 1,
              "--services-v2-marker-scale": 1.2,
              duration: 0.14,
              ease: "back.out(2)"
            },
            markerStart
          )
            .to(
              item,
              {
                "--services-v2-marker-scale": 1,
                duration: 0.12,
                ease: "power2.out"
              },
              markerPop
            )
            .to(
              connectors[index],
              {
                opacity: 1,
                y: 0,
                duration: 0.18
              },
              connectorStart
            )
            .to(
              labels[index],
              {
                opacity: 1,
                y: 0,
                duration: 0.18
              },
              labelStart
            )
            .to(
              cards[index],
              {
                opacity: 1,
                y: 0,
                duration: 0.32,
                ease: "power3.out"
              },
              cardStart
            );
        });

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      }
    );
  }, section);

  return () => {
    mm.revert();
    ctx.revert();
  };
}
