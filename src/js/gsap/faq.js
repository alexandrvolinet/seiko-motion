import { gsap } from "./config.js";

export function animateFaq() {
  const section = document.querySelector(".faq");
  if (!section) return;

  const ctx = gsap.context(() => {
    const faqItems = section.querySelectorAll(".faq__item");
    const faqVisual = section.querySelector(".faq__visual");

    gsap.set(faqItems, { y: 40, opacity: 0 });
    gsap.set(faqVisual, { x: 100, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 50%",
        toggleActions: "play none none none"
      }
    });

    tl.to(faqItems, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.15,
      ease: "power2.out"
    })
    .to(faqVisual, {
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.4");

    return tl;
  }, section);

  return () => ctx.revert();
}

export function initFaqAccordion() {
  const items = document.querySelectorAll(".faq__item");
  if (!items.length) return;

  const closeOtherFaqItems = (currentItem) => {
    items.forEach((item) => {
      if (item !== currentItem && item.classList.contains("is-open")) {
        animateAnswer(item, "out", () => {
          item.classList.remove("is-open");
          item.removeAttribute("open");
        });
      }
    });
  };

  const animateAnswer = (item, direction, onComplete) => {
    const answer = item.querySelector(".faq__answer");
    if (!answer) return;

    if (direction === "in") {
      const originalHeight = answer.scrollHeight;
      answer.style.height = "0px";
      answer.style.overflow = "hidden";
      answer.style.opacity = "0";
      gsap.to(answer, {
        height: originalHeight,
        opacity: 1,
        marginTop: 10,
        duration: 0.5,
        ease: "expo.out",
        onComplete: () => {
          answer.style.height = "";
          answer.style.overflow = "";
          if (onComplete) onComplete();
        }
      });
    } else {
      const originalHeight = answer.scrollHeight;
      answer.style.height = originalHeight + "px";
      answer.style.overflow = "hidden";
      gsap.to(answer, {
        height: 0,
        opacity: 0,
        marginTop: 0,
        duration: 0.5,
        ease: "expo.out",
        onComplete: () => {
          if (onComplete) onComplete();
        }
      });
    }
  };

  items.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = item.classList.contains("is-open");

      if (isOpen) {
        animateAnswer(item, "out", () => {
          item.classList.remove("is-open");
          item.removeAttribute("open");
        });
      } else {
        closeOtherFaqItems(item);
        item.classList.add("is-open");
        item.setAttribute("open", "");
        animateAnswer(item, "in");
      }
    });

    if (item.hasAttribute("open")) {
      item.classList.add("is-open");
    }
  });
}