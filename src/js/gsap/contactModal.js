export function initContactModal() {
  const modal = document.getElementById("contactModal");
  const openBtns = document.querySelectorAll("[data-contact-modal-trigger]");
  const footerInput = document.getElementById("footerEmailInput");
  const modalInput = document.getElementById("modalEmail");
  let closeTimeout = null;
  let previousFocus = null;

  if (!modal || !openBtns.length) return;
  const closeButton = modal.querySelector(".contact-modal__close");

  const open = () => {
    if (closeTimeout) {
      window.clearTimeout(closeTimeout);
      closeTimeout = null;
    }

    if (footerInput && modalInput) {
      modalInput.value = footerInput.value;
    }

    previousFocus = document.activeElement;
    modal.hidden = false;
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => closeButton?.focus());
  };

  const close = () => {
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
    closeTimeout = window.setTimeout(() => {
      if (!modal.classList.contains("is-open")) {
        modal.hidden = true;
        previousFocus?.focus?.();
        previousFocus = null;
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

  closeButton?.addEventListener("click", close);

  modal.querySelector(".contact-modal__overlay")?.addEventListener("click", close);

  document.addEventListener("keydown", (e) => {
    if (modal.hidden) return;
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key !== "Tab") return;
    const focusable = modal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  const form = document.getElementById("contactForm");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
  });
}
