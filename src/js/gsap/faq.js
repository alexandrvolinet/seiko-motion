import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
        start: "top 80%",
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
        animateAnswer(item, "out");
        item.classList.remove("is-open");
        item.removeAttribute("open");
      }
    });
  };

  const animateAnswer = (item, direction) => {
    const answer = item.querySelector(".faq__answer");
    if (!answer) return;

    const content = answer.querySelector("p, ul, ol") || answer;
    const originalHeight = answer.scrollHeight;

    if (direction === "in") {
      answer.style.height = "0px";
      answer.style.overflow = "hidden";
      answer.style.opacity = "0";
      gsap.to(answer, {
        height: originalHeight,
        opacity: 1,
        duration: 0.5,
        ease: "expo.out",
        onComplete: () => {
          answer.style.height = "";
          answer.style.overflow = "";
        }
      });
    } else {
      answer.style.height = originalHeight;
      answer.style.overflow = "hidden";
      gsap.to(answer, {
        height: 0,
        opacity: 0,
        duration: 0.35,
        ease: "expo.in"
      });
    }
  };

  items.forEach((item) => {
    const answer = item.querySelector(".faq__answer");

    item.addEventListener("toggle", () => {
      if (item.open) {
        closeOtherFaqItems(item);
        item.classList.add("is-open");
        animateAnswer(item, "in");
      } else {
        item.classList.remove("is-open");
        animateAnswer(item, "out");
      }
    });

    if (item.hasAttribute("open")) {
      item.classList.add("is-open");
    }
  });
}