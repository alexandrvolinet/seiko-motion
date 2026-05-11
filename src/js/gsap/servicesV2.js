import { gsap } from "./config.js";

function killAnimation(animation) {
  animation?.scrollTrigger?.kill();
  animation?.kill();
}

export function animateServicesV2() {
  const section = document.querySelector(".services-v2");
  if (!section) return;

  const timelineElement = section.querySelector(".services-v2__timeline");
  const progressValue = section.querySelector(".services-v2__progress-value");
  const items = Array.from(section.querySelectorAll(".services-v2__item"));

  if (!timelineElement || !progressValue || !items.length) return;

  const cards = items.map((item) => item.querySelector(".card"));
  const connectors = items.map((item) =>
    item.querySelector(".services-v2__connector")
  );
  const labels = items.map((item) => item.querySelector(".services-v2__label"));

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

        gsap.set(items, {
          "--services-v2-marker-opacity": 0
        });

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

        if (isVertical) {
          const animations = items.map((item, index) => {
            const progressScale = (index + 1) / items.length;

            return gsap
              .timeline({
                defaults: {
                  ease: "power2.out"
                },
                scrollTrigger: {
                  trigger: item,
                  start: "top 80%",
                  toggleActions: "play none none none"
                }
              })
              .to(
                progressValue,
                {
                  scaleY: progressScale,
                  duration: 0.28,
                  overwrite: "auto"
                },
                0
              )
              .to(
                item,
                {
                  "--services-v2-marker-opacity": 1,
                  duration: 0.14
                },
                0.04
              )
              .to(
                connectors[index],
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.18
                },
                0.1
              )
              .to(
                labels[index],
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.18
                },
                0.14
              )
              .to(
                cards[index],
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.32,
                  ease: "power3.out"
                },
                0.18
              );
          });

          return () => {
            animations.forEach(killAnimation);
          };
        }

        const desktopTimeline = gsap.timeline({
          defaults: {
            ease: "power2.out"
          },
          scrollTrigger: {
            trigger: timelineElement,
            start: "top 70%",
            toggleActions: "play none none none"
          }
        });

        desktopTimeline.to(
          progressValue,
          {
            [progressAxis]: 1,
            duration: 1.2
          },
          0
        );

        items.forEach((item, index) => {
          const markerStart = 0.16 + index * 0.24;
          const connectorStart = markerStart + 0.05;
          const labelStart = markerStart + 0.08;
          const cardStart = markerStart + 0.12;

          desktopTimeline
            .to(
              item,
              {
                "--services-v2-marker-opacity": 1,
                duration: 0.14
              },
              markerStart
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
          killAnimation(desktopTimeline);
        };
      }
    );
  }, section);

  return () => {
    mm.revert();
    ctx.revert();
  };
}
