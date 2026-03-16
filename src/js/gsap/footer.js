import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateFooter() {
  const footer = document.querySelector(".footer");
  if (!footer) r
  const ctx = gsap.context(() => {
    const logo = footer.querySelector(".footer__logo");
    const credentials = footer.querySelector(".footer__credentials");
    const socials = footer.querySelector(".footer__socials");
    const email = footer.querySelector(".footer__email");

    const elements = [logo, credentials, socials, email];

    gsap.set(elements, {
      y: 60,
      opacity: 0
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footer,
        start: "top 70%",
        toggleActions: "play none none none"
      }
    });

    tl.to(elements, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.2,
      ease: "power2.out"
    });

    return tl;
  }, footer);

  return () => ctx.revert();
}