import { gsap } from "./config.js";
import { animateTextReveal } from "./responsiveReveal.js";

export function animateFaq() {
  const section = document.querySelector(".faq");
  if (!section) return;

  const ctx = gsap.context(() => {
    const faqItems = section.querySelectorAll(".faq__item");
    const faqVisual = section.querySelector(".faq__visual");

    animateTextReveal(faqItems, {
      scope: section,
      y: 28,
      duration: 0.9,
      ease: "power2.out",
      stagger: 0.08,
      scrollTrigger: {
        trigger: section,
        start: "top 82%",
        toggleActions: "play none none none"
      }
    });

    animateTextReveal([faqVisual], {
      scope: section,
      y: 28,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 50%",
        toggleActions: "play none none none"
      }
    });
  }, section);

  return () => ctx.revert();
}

export function initFaqAccordion() {
  const items = document.querySelectorAll(".faq__item");
  if (!items.length) return;

  const closeOtherFaqItems = (currentItem) => {
    items.forEach((item) => {
      if (item !== currentItem && item.classList.contains("is-open")) {
        item.classList.remove("is-open");
        animateAnswer(item, "out");
      }
    });
  };

  const animateAnswer = (item, direction) => {
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
        ease: "expo.out"
      });
    }
  };

  items.forEach((item) => {
    const answer = item.querySelector(".faq__answer");

    item.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = item.classList.contains("is-open");

      if (isOpen) {
        item.classList.remove("is-open");
        animateAnswer(item, "out");
      } else {
        closeOtherFaqItems(item);
        item.classList.add("is-open");
        animateAnswer(item, "in");
      }
    });

    if (item.classList.contains("is-open")) {
      item.classList.add("is-open");

      if (answer) {
        answer.style.height = "";
        answer.style.overflow = "";
        answer.style.opacity = "1";
        answer.style.marginTop = "10px";
      }
    }
  });
}
