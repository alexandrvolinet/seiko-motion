// Fallback page preloading for browsers without Speculation Rules
// (Firefox, Safari): warms the HTTP cache on hover/focus so the
// subsequent navigation skips the network wait.
const MAX_PREFETCHES = 8;
const prefetched = new Set();

function resolvePageUrl(anchor) {
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#")) return null;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return null;

  let url;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return null;
  }

  if (url.origin !== window.location.origin) return null;
  // Same-page anchors need no preloading.
  if (url.pathname === window.location.pathname) return null;
  if (!url.pathname.endsWith(".html") && url.pathname !== "/") return null;

  return url.href;
}

function prefetch(url) {
  if (prefetched.has(url) || prefetched.size >= MAX_PREFETCHES) return;
  if (navigator.connection && navigator.connection.saveData) return;

  prefetched.add(url);
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.as = "document";
  link.href = url;
  document.head.appendChild(link);
}

export function initPrefetch() {
  const onHover = (event) => {
    const anchor = event.target.closest("a[href]");
    if (!anchor) return;
    const url = resolvePageUrl(anchor);
    if (url) prefetch(url);
  };

  document.addEventListener("pointerover", onHover, { passive: true });
  document.addEventListener("touchstart", onHover, { passive: true });
  document.addEventListener("focusin", onHover);

  return () => {
    document.removeEventListener("pointerover", onHover);
    document.removeEventListener("touchstart", onHover);
    document.removeEventListener("focusin", onHover);
  };
}
