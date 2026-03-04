import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

export function animateFooter() {
  const footer = document.querySelector(".footer");
  if (!footer) return;

  const logo = footer.querySelector(".footer__logo");
  const credentials = footer.querySelector(".footer__credentials");
  const socials = footer.querySelector(".footer__socials");
  const email = footer.querySelector(".footer__email");

  const elements = [credentials, socials, email];
  const paths = footer.querySelectorAll(".footer__logo .st0");

  gsap.set(paths, {
    fill: "transparent",
    stroke: "#fff",
    strokeWidth: 1,
    drawSVG: "0%"
  });

  gsap.set([logo, ...elements], {
    y: 60,
    opacity: 0
  });

  ScrollTrigger.create({
    trigger: footer,
    start: "top 85%",
    once: true,
    onEnter: () => {

      const logoTl = gsap.timeline();

      logoTl
        .to(logo, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out"
        })
        .to(paths, {
          drawSVG: "100%",
          duration: 0.8,
          stagger: 0.05,
          ease: "power2.out"
        })
        .to(paths, {
          fill: "#fff",
          duration: 0.4,
          stagger: 0.05,
          ease: "power1.out"
        }, "-=0.4");

      gsap.to(elements, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.3,
        ease: "power2.out",
        delay: 0.3
      });
    }
  });
}