import "../scss/main.scss";
import { animateHeader, pinHeader } from "./gsap/header.js";
import { heroTitle, heroCTA } from "./gsap/hero.js";
import { arc } from "./gsap/hero.js";

let isCriticalStarted = false;
let isDeferredStarted = false;
let criticalReadyPromise = Promise.resolve();
let deferredModulesPromise;

function hideLoader() {
  document.querySelector(".loader")?.classList.add("loader--hidden");
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
    import("./gsap/design.js"),
    import("./gsap/footer.js"),
    import("./gsap/process.js"),
    import("./gsap/faq.js"),
  ]);

  return deferredModulesPromise;
}

async function startCriticalExperience() {
  if (isCriticalStarted) return;
  isCriticalStarted = true;

  await waitForCriticalResources();
  hideLoader();
  animateHeader();
  heroTitle();
  heroCTA();
  arc();
}

async function startDeferredExperience() {
  if (isDeferredStarted) return;
  isDeferredStarted = true;

  const [
    pageModule,
    statsModule,
    showcaseModule,
    servicesModule,
    designModule,
    footerModule,
    processModule,
    faqModule,
  ] = await loadDeferredModules();

  faqModule.initFaqAccordion();
  faqModule.animateFaq();
  pageModule.revealSections();
  pageModule.animateBackgroundDots();
  designModule.animateDesign();
  servicesModule.animateServicesV2();
  showcaseModule.showcaseUp();
  statsModule.animateStats();
  processModule.animateProcessMedia();
  processModule.initProcessVideo();
  footerModule.animateFooter();
}

document.addEventListener("DOMContentLoaded", () => {
  pinHeader();
  criticalReadyPromise = startCriticalExperience();
});

window.addEventListener("load", () => {
  criticalReadyPromise.finally(startDeferredExperience);
});
