import "../scss/main.scss";
import { revealSections, animateBackgroundDots } from "./gsap/page.js";
import { animateHeader, pinHeader } from "./gsap/header.js";
import { heroTitle, heroCTA } from "./gsap/hero.js";
import { arc } from "./gsap/hero.js";
import { animateStats } from "./gsap/stats.js";
import { showcaseUp } from "./gsap/showcase.js";
import { animateServices } from "./gsap/services.js";
import { animateDesign } from "./gsap/design.js";
import { animateFooter } from "./gsap/footer.js";
import { animateProcessMedia } from "./gsap/process.js";
import { animateFaq, initFaqAccordion } from "./gsap/faq.js";

// video
// const video = document.querySelector(".process__video-el");
// const control = document.querySelector(".process__control");

// let hideTimeout;

// function showControl() {
//   control.style.opacity = "1";
// }

// function hideControl() {
//   if (!video.paused) {
//     control.style.opacity = "0";
//   }
// }

// function toggleVideo() {
//   if (video.paused) {
//     video.play();
//   } else {
//     video.pause();
//   }
// }

// video.addEventListener("play", () => {
//   control.classList.remove("is-paused");
//   control.classList.add("is-playing");

//   clearTimeout(hideTimeout);
//   hideTimeout = setTimeout(hideControl, 800);
// });

// video.addEventListener("pause", () => {
//   control.classList.remove("is-playing");
//   control.classList.add("is-paused");
//   showControl();
// });

// control.addEventListener("click", toggleVideo);
// video.addEventListener("click", toggleVideo);

// video.addEventListener("mousemove", () => {
//   if (!video.paused) {
//     showControl();
//     clearTimeout(hideTimeout);
//     hideTimeout = setTimeout(hideControl, 800);
//   }
// });
// video end

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
  animateServices();
  animateFaq();
  initFaqAccordion();
  showcaseUp();
  animateStats();
  animateProcessMedia();
  animateFooter();
});

// loader end