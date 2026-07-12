export function initContactModal() {
  const modal = document.getElementById("contactModal");
  const openBtns = document.querySelectorAll("[data-contact-modal-trigger]");
  const footerInput = document.getElementById("footerEmailInput");
  const modalInput = document.getElementById("modalEmail");
  let closeTimeout = null;

  if (!modal || !openBtns.length) return;

  const open = () => {
    if (closeTimeout) {
      window.clearTimeout(closeTimeout);
      closeTimeout = null;
    }

    if (footerInput && modalInput) {
      modalInput.value = footerInput.value;
    }

    modal.hidden = false;
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
    closeTimeout = window.setTimeout(() => {
      if (!modal.classList.contains("is-open")) {
        modal.hidden = true;
      }
    }, 300);
  };

  modal.hidden = true;
  modal.classList.remove("is-open");

  openBtns.forEach((openBtn) => {
    openBtn.addEventListener("click", (e) => {
      e.preventDefault();
      open();
    });
  });

  modal.querySelector(".contact-modal__close")?.addEventListener("click", close);

  modal.querySelector(".contact-modal__overlay")?.addEventListener("click", close);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  const form = document.getElementById("contactForm");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
  });
}
