export function initVideoAutoplay() {
  const videos = document.querySelectorAll(".project-card__video");
  if (!videos.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    {
      rootMargin: "50px 0px",
      threshold: 0.25,
    }
  );

  videos.forEach((video) => observer.observe(video));

  return () => observer.disconnect();
}