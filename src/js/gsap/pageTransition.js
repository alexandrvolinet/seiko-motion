import { gsap } from "./config.js";

const FLAG_KEY = "seiko-page-transition";
const EXIT_DURATION = 0.4;
const ENTER_DURATION = 0.4;
const FALLBACK_TIMEOUT = 1200;

function isInternalPageUrl(url) {
  if (url.origin !== window.location.origin) return false;

  // Same-page anchors are handled by smooth scroll, not a transition.
  if (url.pathname === window.location.pathname && url.hash) return false;

  return true;
}

function shouldIntercept(event, anchor) {
  if (event.defaultPrevented) return false;
  if (event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return false;
  }
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;

  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#")) return false;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return false;

  let url;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return false;
  }

  if (!isInternalPageUrl(url)) return false;

  if (
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return false;
  }

  return true;
}

export function initPageTransitions() {
  const overlay = document.querySelector(".page-transition");
  if (!overlay) return () => {};

  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ENTRY: arrived from another page via transition - start covered,
  // then slide the overlay up to reveal the new page.
  let entered = false;
  try {
    entered = sessionStorage.getItem(FLAG_KEY) === "1";
    sessionStorage.removeItem(FLAG_KEY);
  } catch {
    entered = false;
  }

  if (entered && !reduceMotion) {
    gsap.set(overlay, { autoAlpha: 1 });

    let revealed = false;
    const playEnter = () => {
      if (revealed) return;
      revealed = true;
      window.clearTimeout(safetyTimer);
      gsap.to(overlay, {
        autoAlpha: 0,
        duration: ENTER_DURATION,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(overlay, { autoAlpha: 0 });
        },
      });
    };

    // Reveal only after deferred animations are initialized and
    // ScrollTriggers are refreshed - otherwise content would flash
    // visible and then jump to hidden initial states.
    window.addEventListener("seiko:page-ready", playEnter, { once: true });
    // Safety net: never leave the overlay stuck if deferred init fails.
    const safetyTimer = window.setTimeout(playEnter, 6000);
  } else {
    gsap.set(overlay, { autoAlpha: 0 });
  }

  // EXIT: intercept clicks to project pages, cover the screen, then go.
  const onClick = (event) => {
    const anchor = event.target.closest("a[href]");
    if (!anchor || !shouldIntercept(event, anchor)) return;

    event.preventDefault();
    const url = anchor.href;

    try {
      sessionStorage.setItem(FLAG_KEY, "1");
    } catch {
      // storage unavailable - entry side will simply skip the reveal
    }

    let navigated = false;
    const go = () => {
      if (navigated) return;
      navigated = true;
      window.location.href = url;
    };
    const fallback = window.setTimeout(go, FALLBACK_TIMEOUT);

    gsap.fromTo(
      overlay,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: EXIT_DURATION,
        ease: "power2.inOut",
        onComplete: () => {
          window.clearTimeout(fallback);
          go();
        },
      }
    );
  };

  document.addEventListener("click", onClick);

  // Back/forward navigation may restore the page from bfcache in the exact
  // state we left it - with the overlay covering the screen (exit played,
  // then we navigated away). Reset it so the restored page is never black.
  const onPageShow = (event) => {
    if (!event.persisted) return;
    gsap.killTweensOf(overlay);
    gsap.set(overlay, { autoAlpha: 0 });
  };

  window.addEventListener("pageshow", onPageShow);

  return () => {
    document.removeEventListener("click", onClick);
    window.removeEventListener("pageshow", onPageShow);
  };
}
