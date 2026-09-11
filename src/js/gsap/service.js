export function initServiceSlider() {
  const slider = document.querySelector("[data-service-slider]");
  if (!slider) return () => {};

  const track = slider.querySelector(".project__slider-track");
  const prev = slider.querySelector("[data-service-prev]");
  const next = slider.querySelector("[data-service-next]");
  const progress = slider.querySelector("[data-service-progress]");
  if (!track) return () => {};

  const step = () => {
    const card = track.querySelector(".project__slide");
    return card ? card.getBoundingClientRect().width + 16 : 320;
  };

  const sync = () => {
    const max = track.scrollWidth - track.clientWidth;
    const ratio = max > 0 ? track.scrollLeft / max : 0;
    if (progress) progress.style.width = `${Math.round(ratio * 100)}%`;
    if (prev) prev.disabled = track.scrollLeft <= 4;
    if (next) next.disabled = track.scrollLeft >= max - 4;
  };

  let syncQueued = false;
  const onScroll = () => {
    if (syncQueued) return;
    syncQueued = true;
    window.requestAnimationFrame(() => {
      syncQueued = false;
      sync();
    });
  };

  const go = (dir) => {
    track.scrollBy({ left: dir * step(), behavior: "smooth" });
  };
  const onPrev = () => go(-1);
  const onNext = () => go(1);

  prev?.addEventListener("click", onPrev);
  next?.addEventListener("click", onNext);
  track.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", sync);
  sync();

  return () => {
    prev?.removeEventListener("click", onPrev);
    next?.removeEventListener("click", onNext);
    track.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", sync);
  };
}
