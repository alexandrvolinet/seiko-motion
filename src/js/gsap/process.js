import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initProcessVideo() {
  const section = document.querySelector(".process");
  if (!section) return;

  const videoWrap = section.querySelector(".process__video");
  const video = section.querySelector(".process__video-el");
  const control = section.querySelector(".process__control");
  const HIDE_DELAY = 1400;
  let hideControlTimeout = null;

  if (!videoWrap || !video || !control) return;

  const clearHideControlTimeout = () => {
    if (hideControlTimeout) {
      window.clearTimeout(hideControlTimeout);
      hideControlTimeout = null;
    }
  };

  const showControl = () => {
    control.classList.add("is-visible");
  };

  const hideControl = () => {
    if (video.paused) return;

    control.classList.remove("is-visible");
  };

  const scheduleHideControl = () => {
    clearHideControlTimeout();

    if (video.paused) {
      showControl();
      return;
    }

    hideControlTimeout = window.setTimeout(() => {
      hideControl();
    }, HIDE_DELAY);
  };

  const syncControlState = () => {
    const isPaused = video.paused;

    control.classList.toggle("is-paused", isPaused);
    control.classList.toggle("is-playing", !isPaused);
    control.setAttribute("aria-label", isPaused ? "Play video" : "Pause video");
    control.setAttribute("aria-pressed", String(!isPaused));

    if (isPaused) {
      clearHideControlTimeout();
      showControl();
      return;
    }

    showControl();
    scheduleHideControl();
  };

  const togglePlayback = async () => {
    if (video.paused) {
      try {
        await video.play();
      } catch {
        syncControlState();
      }

      return;
    }

    video.pause();
  };

  const handleControlClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    togglePlayback();
  };

  const handleVideoClick = () => {
    togglePlayback();
  };

  const handlePointerMove = () => {
    if (video.paused) return;

    showControl();
    scheduleHideControl();
  };

  const handlePointerLeave = () => {
    clearHideControlTimeout();
    hideControl();
  };

  control.addEventListener("click", handleControlClick);
  video.addEventListener("click", handleVideoClick);
  videoWrap.addEventListener("pointermove", handlePointerMove);
  videoWrap.addEventListener("pointerleave", handlePointerLeave);
  video.addEventListener("play", syncControlState);
  video.addEventListener("pause", syncControlState);
  video.addEventListener("ended", syncControlState);

  syncControlState();

  return () => {
    clearHideControlTimeout();
    control.removeEventListener("click", handleControlClick);
    video.removeEventListener("click", handleVideoClick);
    videoWrap.removeEventListener("pointermove", handlePointerMove);
    videoWrap.removeEventListener("pointerleave", handlePointerLeave);
    video.removeEventListener("play", syncControlState);
    video.removeEventListener("pause", syncControlState);
    video.removeEventListener("ended", syncControlState);
  };
}

export function animateProcessMedia() {
  const section = document.querySelector(".process");
  if (!section) return;

  const ctx = gsap.context(() => {
    const media = section.querySelector(".process__media");

    gsap.set(media, {
      y: 80,
      scale: 0.7,
      opacity: 0,
      transformOrigin: "center center",
      willChange: "transform, opacity"
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        toggleActions: "play none none none"
      }
    });

    tl.to(media, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "power2.out"
    });

    return tl;
  }, section);

  return () => ctx.revert();
} 
