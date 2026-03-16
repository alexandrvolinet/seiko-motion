import "../scss/main.scss";
import { animateHeader } from "./gsap/page.js";
import { revealSections } from "./gsap/page.js";
import { heroCTA } from "./gsap/hero.js";
import { arc } from "./gsap/hero.js";
import { animateStats } from "./gsap/stats.js";
import { showcaseUp } from "./gsap/showcase.js";
import { animateServices } from "./gsap/services.js";
import { animateDesign } from "./gsap/design.js";
import { animateFooter } from "./gsap/footer.js";
import { animateProcessMedia } from "./gsap/process.js";
import { animateBackgroundDots} from "./gsap/page.js";


// burger menu
const burger = document.querySelector(".burger");
const mobileMenu = document.querySelector(".mobile-menu");
const menuLinks = mobileMenu.querySelectorAll("a");
const closeBtn = document.querySelector(".mobile-menu__close");

burger.addEventListener("click", () => {
  burger.classList.toggle("is-active");
  mobileMenu.classList.toggle("is-open");
  document.body.classList.toggle("menu-open");
});

menuLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

closeBtn.addEventListener("click", closeMenu);

mobileMenu.addEventListener("click", (e) => {
  if (e.target === mobileMenu) {
    closeMenu();
  }
});

function closeMenu() {
  burger.classList.remove("is-active");
  mobileMenu.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}
// burger menu end

// faq section
const faqItems = document.querySelectorAll(".faq__item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq__question");

  question.addEventListener("click", () => {
    const isOpen = item.classList.contains("is-open");

    faqItems.forEach((i) => i.classList.remove("is-open"));

    if (!isOpen) {
      item.classList.add("is-open");
    }
  });
});
// faq section end

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
  revealSections();
  animateBackgroundDots();
  heroCTA();
  arc();
  animateDesign();
  animateServices();
  showcaseUp();
  animateStats();
  animateProcessMedia();
  animateFooter();
});

// loader end
