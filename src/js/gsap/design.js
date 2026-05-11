import { gsap } from "./config.js";

function killTimeline(timeline) {
  timeline?.scrollTrigger?.kill();
  timeline?.kill();
}

export function animateDesign() {
  const section = document.querySelector(".design");
  if (!section) return;

  const leftCard = section.querySelector(".card:first-child");
  const gradient = section.querySelector(".card__gradient");
  const rocket = section.querySelector(".card__gradient img");
  const rightCard = section.querySelector(".card:last-child");
  const bottomBlock = section.querySelector(".card__background--transparent");

  if (!leftCard || !gradient || !rocket || !rightCard || !bottomBlock) return;

  const mm = gsap.matchMedia();
  const ctx = gsap.context(() => {
    mm.add({ all: "all", stacked: "(max-width: 1600px)" }, (mediaContext) => {
      const isStacked = mediaContext.conditions.stacked;

      if (isStacked) {
        gsap.set([leftCard, gradient, rightCard], {
          y: 60,
          opacity: 0,
          willChange: "transform, opacity"
        });

        gsap.set(rocket, {
          scale: 0.85,
          opacity: 0,
          transformOrigin: "center center",
          willChange: "transform, opacity"
        });

        gsap.set(bottomBlock, {
          y: 40,
          opacity: 0,
          scale: 0.95,
          willChange: "transform, opacity"
        });

        const animations = [
          gsap.timeline({
            scrollTrigger: {
              trigger: leftCard,
              start: "top 82%",
              toggleActions: "play none none none"
            }
          }).to(leftCard, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out"
          }),
          gsap.timeline({
            scrollTrigger: {
              trigger: rightCard,
              start: "top 82%",
              toggleActions: "play none none none"
            }
          })
            .to(rightCard, {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out"
            })
            .to(
              bottomBlock,
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.7,
                ease: "power3.out"
              },
              "-=0.3"
            ),
          gsap.timeline({
            scrollTrigger: {
              trigger: gradient,
              start: "top 82%",
              toggleActions: "play none none none"
            }
          })
            .to(gradient, {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out"
            })
            .to(
              rocket,
              {
                scale: 1,
                opacity: 1,
                duration: 0.8,
                ease: "back.out(1.2)"
              },
              "-=0.5"
            )
        ];

        return () => {
          animations.forEach(killTimeline);
        };
      }

      gsap.set(leftCard, { y: 60, opacity: 0 });
      gsap.set(gradient, { y: 60, opacity: 0 });
      gsap.set(rocket, {
        scale: 0.85,
        opacity: 0,
        transformOrigin: "center center"
      });
      gsap.set(rightCard, { y: 60, opacity: 0 });
      gsap.set(bottomBlock, { y: 60, opacity: 0, scale: 0.95 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      });

      timeline
        .to(leftCard, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out"
        })
        .to(
          gradient,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out"
          },
          "-=0.4"
        )
        .to(
          rocket,
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "back.out(1.2)"
          },
          "-=0.6"
        )
        .to(
          rightCard,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out"
          },
          "-=0.4"
        )
        .to(
          bottomBlock,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: "power3.out"
          },
          "-=0.3"
        );

      return () => {
        killTimeline(timeline);
      };
    });
  }, section);

  return () => {
    mm.revert();
    ctx.revert();
  };
}
