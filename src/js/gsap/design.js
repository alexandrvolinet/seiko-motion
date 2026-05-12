import { gsap } from "./config.js";

function playDesignVideo(video) {
  if (!video || !video.paused) return;

  video.play().catch(() => {});
}

function killAnimation(animation) {
  animation?.scrollTrigger?.kill();
  animation?.kill();
}

export function animateDesign() {
  const section = document.querySelector(".design");
  if (!section) return;

  const items = Array.from(section.querySelectorAll(".design__item"));
  const visual = section.querySelector(".design__visual");
  const videoStage = section.querySelector(".design__video-stage");
  const videoShell = section.querySelector(".design__video-shell");
  const video = section.querySelector(".design__video");

  if (!items.length || !visual || !videoStage || !videoShell || !video) return;

  const mm = gsap.matchMedia();
  const cleanups = [];

  const ctx = gsap.context(() => {
    const floatTween = gsap.to(videoShell, {
      yPercent: -2.4,
      rotateZ: -0.8,
      duration: 4.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    cleanups.push(() => killAnimation(floatTween));

    mm.add({ all: "all", stacked: "(max-width: 991px)" }, (mediaContext) => {
      const isStacked = mediaContext.conditions.stacked;

      gsap.set(items, {
        y: 36,
        opacity: 0,
        willChange: "transform, opacity"
      });

      gsap.set(videoStage, {
        x: 0,
        y: 72,
        scale: 0.84,
        opacity: 0,
        rotateX: 0,
        rotateY: 0,
        willChange: "transform, opacity"
      });

      if (isStacked) {
        const animations = [
          ...items.map((item) =>
            gsap.to(item, {
              y: 0,
              opacity: 1,
              duration: 0.72,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 84%",
                toggleActions: "play none none none"
              }
            })
          ),
          gsap.to(videoStage, {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: visual,
              start: "top 80%",
              toggleActions: "play none none none",
              onEnter: () => playDesignVideo(video)
            }
          })
        ];

        return () => {
          animations.forEach(killAnimation);
        };
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 42%",
          toggleActions: "play none none none",
          onEnter: () => playDesignVideo(video)
        }
      });

      timeline
        .to(
          videoStage,
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out"
          },
          0
        )
        .to(
          items,
          {
            y: 0,
            opacity: 1,
            duration: 0.72,
            stagger: 0.14,
            ease: "power3.out"
          },
          0.16
        );

      const handleMove = (event) => {
        const bounds = visual.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;

        gsap.to(videoStage, {
          x: x * 18,
          y: y * 12,
          rotateY: x * 12,
          rotateX: y * -10,
          duration: 0.65,
          ease: "power2.out",
          overwrite: "auto"
        });
      };

      const handleLeave = () => {
        gsap.to(videoStage, {
          x: 0,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          duration: 0.8,
          ease: "power3.out"
        });
      };

      visual.addEventListener("mousemove", handleMove);
      visual.addEventListener("mouseleave", handleLeave);

      return () => {
        killAnimation(timeline);
        visual.removeEventListener("mousemove", handleMove);
        visual.removeEventListener("mouseleave", handleLeave);
      };
    });
  }, section);

  return () => {
    cleanups.forEach((cleanup) => cleanup?.());
    mm.revert();
    ctx.revert();
  };
}
