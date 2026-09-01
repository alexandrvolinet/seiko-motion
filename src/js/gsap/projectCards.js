export function initProjectCards() {
  const toggles = document.querySelectorAll(".project-card__toggle");
  if (!toggles.length) return;

  document.querySelectorAll(".project-card").forEach((card) => {
    const title = card.querySelector(".project-card__title")?.textContent?.trim();
    card.querySelectorAll(".project-card__link").forEach((link) => {
      if (!link.textContent.trim() && title) link.setAttribute("aria-label", `View ${title} project`);
    });
  });

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const card = toggle.closest(".project-card");
      const detailsId = toggle.getAttribute("aria-controls");
      const details = card?.querySelector(`.project-card__details[id="${detailsId}"]`);
      if (!details) return;
      const isOpen = details.classList.toggle("is-open");
      toggle.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      details.setAttribute("aria-hidden", String(!isOpen));
    });
  });
}