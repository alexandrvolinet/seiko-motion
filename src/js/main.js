import "../scss/main.scss";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animateHeader, initMobileMenu, pinHeader } from "./gsap/header.js";
import { heroTitle, heroCTA, initHeroExpand } from "./gsap/hero.js";
import { arc } from "./gsap/hero.js";
import { initContactModal } from "./gsap/contactModal.js";
import { initShowcaseExpand } from "./gsap/showcaseExpand.js";
import { initProjectCards } from "./gsap/projectCards.js";

let isCriticalStarted = false;
let isDeferredStarted = false;
let criticalReadyPromise = Promise.resolve();
let deferredModulesPromise;
let resizeRefreshTimeout = null;
let lastResizeScrollX = 0;
let lastResizeScrollY = 0;
let designStarted = false;
let designCleanup = null;
let designObserver = null;

function refreshScrollTriggersOnResize() {
  lastResizeScrollX = window.scrollX || window.pageXOffset || 0;
  lastResizeScrollY = window.scrollY || window.pageYOffset || 0;
  document.documentElement.classList.add("is-resizing");

  if (resizeRefreshTimeout) {
    window.clearTimeout(resizeRefreshTimeout);
  }

  resizeRefreshTimeout = window.setTimeout(() => {
    resizeRefreshTimeout = null;

    ScrollTrigger.refresh(true);

    window.requestAnimationFrame(() => {
      window.scrollTo({
        left: lastResizeScrollX,
        top: lastResizeScrollY,
        behavior: "auto",
      });
      window.requestAnimationFrame(() => {
        document.documentElement.classList.remove("is-resizing");
      });
    });
  }, 180);
}

function hideLoader() {
  document.querySelector(".loader")?.classList.add("loader--hidden");
  document.documentElement.classList.remove("is-loading");
  document.body.classList.add("page-loaded");
}

function waitForCriticalFonts() {
  if (!document.fonts?.load) return Promise.resolve();

  return Promise.all([
    document.fonts.load('400 64px "Azonix"'),
    document.fonts.load('400 44px "Azonix"'),
    document.fonts.load('400 22px "Azonix"'),
  ]).catch(() => {});
}

function waitForImage(image) {
  if (!image) return Promise.resolve();

  if (image.complete) {
    if (typeof image.decode === "function") {
      return image.decode().catch(() => {});
    }

    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const cleanup = () => {
      image.removeEventListener("load", handleLoad);
      image.removeEventListener("error", handleError);
    };

    const handleLoad = () => {
      cleanup();

      if (typeof image.decode === "function") {
        image.decode().catch(() => {}).finally(resolve);
        return;
      }

      resolve();
    };

    const handleError = () => {
      cleanup();
      resolve();
    };

    image.addEventListener("load", handleLoad);
    image.addEventListener("error", handleError);
  });
}

function waitForCriticalResources() {
  const criticalImages = Array.from(
    document.querySelectorAll(".header img, .home img"),
  );

  return Promise.all([
    waitForCriticalFonts(),
    ...criticalImages.map(waitForImage),
  ]);
}

function loadDeferredModules() {
  deferredModulesPromise ??= Promise.all([
    import("./gsap/page.js"),
    import("./gsap/stats.js"),
    import("./gsap/showcase.js"),
    import("./gsap/servicesV2.js"),
    import("./gsap/footer.js"),
    import("./gsap/process.js"),
    import("./gsap/faq.js"),
    import("./gsap/contact.js"),
    import("./gsap/projects.js"),
  ]);

  return deferredModulesPromise;
}

async function startCriticalExperience() {
  if (isCriticalStarted) return;
  isCriticalStarted = true;

  await waitForCriticalResources();
  animateHeader();
  heroTitle();
  heroCTA();
  arc();
  hideLoader();
}

async function startDeferredExperience() {
  if (isDeferredStarted) return;
  isDeferredStarted = true;

  const [
    pageModule,
    statsModule,
    showcaseModule,
    servicesModule,
    footerModule,
    processModule,
    faqModule,
    contactModule,
    projectsModule,
  ] = await loadDeferredModules();

  faqModule.initFaqAccordion();
  faqModule.animateFaq();
  pageModule.revealSections();
  pageModule.animateBackgroundDots();
  servicesModule.animateServicesV2();
  showcaseModule.showcaseUp();
  statsModule.animateStats();
  processModule.animateProcessTimeline();
  processModule.animateProcessMedia();
  processModule.initProcessVideo();
  footerModule.animateFooter();
  contactModule.animateContactCards();
  projectsModule.initProjectCards();
  projectsModule.animateProjectCards();
}

function lazyLoadDesign() {
  const section = document.querySelector("#design");
  if (!section) return;

  const startDesign = async () => {
    if (designStarted) return;
    designStarted = true;
    designObserver?.disconnect();
    designObserver = null;
    const designModule = await import("./gsap/design.js");
    designCleanup = await designModule.animateDesign();
  };

  if (!("IntersectionObserver" in window)) {
    startDesign();
    return;
  }

  designObserver = new IntersectionObserver(
    ([entry]) => { if (entry.isIntersecting) startDesign(); },
    { rootMargin: "250px 0px", threshold: 0.01 },
  );
  designObserver.observe(section);
}

document.addEventListener("DOMContentLoaded", () => {
  pinHeader();
  initMobileMenu();
  initContactModal();
  initShowcaseExpand();
  initHeroExpand();
  lazyLoadDesign();

  window.addEventListener("resize", refreshScrollTriggersOnResize, { passive: true });
  window.visualViewport?.addEventListener("resize", refreshScrollTriggersOnResize, { passive: true });
  criticalReadyPromise = startCriticalExperience();
});

window.addEventListener("load", () => {
  criticalReadyPromise.finally(startDeferredExperience);
});

window.addEventListener("pagehide", (event) => {
  if (event.persisted) return;
  designObserver?.disconnect();
  designObserver = null;
  designCleanup?.();
  designCleanup = null;
});
