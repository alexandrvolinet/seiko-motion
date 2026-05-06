import "../scss/main.scss";
import { revealSections, animateBackgroundDots } from "./gsap/page.js";
import { animateHeader, pinHeader } from "./gsap/header.js";
import { heroTitle, heroCTA } from "./gsap/hero.js";
import { arc } from "./gsap/hero.js";
import { animateStats } from "./gsap/stats.js";
import { showcaseUp } from "./gsap/showcase.js";
import { animateServicesV2 } from "./gsap/servicesV2.js";
import { animateDesign } from "./gsap/design.js";
import { animateFooter } from "./gsap/footer.js";
import { animateProcessMedia } from "./gsap/process.js";
import { animateFaq, initFaqAccordion } from "./gsap/faq.js";

// loader

window.addEventListener("load", () => {
  document.querySelector(".loader").classList.add("loader--hidden");
  document.body.classList.add("page-loaded"); 
  
  animateHeader();
  heroTitle();
  pinHeader();
  revealSections();
  animateBackgroundDots();
  heroCTA();
  arc();
  animateDesign();
  animateServicesV2();
  animateFaq();
  initFaqAccordion();
  showcaseUp();
  animateStats();
  animateProcessMedia();
  animateFooter();
});

// loader end
