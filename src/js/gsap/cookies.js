const STORAGE_KEY = "seiko-cookie-consent";
const CONSENT_VERSION = "v1";

function readConsent() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || data.version !== CONSENT_VERSION) return null;
    return data;
  } catch {
    return null;
  }
}

function writeConsent(status) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ status, version: CONSENT_VERSION, date: new Date().toISOString() })
    );
  } catch {
    // private mode etc. - banner simply won't persist, which is fine
  }
}

export function resetCookieConsent() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function initCookieConsent() {
  const banner = document.getElementById("cookieConsent");
  if (!banner) return () => {};

  const acceptBtn = banner.querySelector("[data-cookie-accept]");
  const rejectBtn = banner.querySelector("[data-cookie-reject]");

  const show = () => {
    banner.hidden = false;
    banner.setAttribute("aria-hidden", "false");
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => banner.classList.add("is-visible"));
    });
  };

  const hide = () => {
    banner.classList.remove("is-visible");
    banner.setAttribute("aria-hidden", "true");
    window.setTimeout(() => {
      banner.hidden = true;
    }, 450);
  };

  const choose = (status) => {
    writeConsent(status);
    hide();
  };

  const onAccept = () => choose("accepted");
  const onReject = () => choose("rejected");
  const onReopen = (event) => {
    event.preventDefault();
    show();
  };

  // Respect Global Privacy Control: treat as rejection, don't nag.
  const hasChoice = Boolean(readConsent());
  const gpc =
    typeof navigator.globalPrivacyControl !== "undefined" &&
    navigator.globalPrivacyControl === true;

  if (!hasChoice) {
    if (gpc) {
      writeConsent("rejected");
    } else {
      show();
    }
  }

  acceptBtn?.addEventListener("click", onAccept);
  rejectBtn?.addEventListener("click", onReject);
  document.querySelectorAll("[data-cookie-settings]").forEach((el) => {
    el.addEventListener("click", onReopen);
  });

  return () => {
    acceptBtn?.removeEventListener("click", onAccept);
    rejectBtn?.removeEventListener("click", onReject);
    document.querySelectorAll("[data-cookie-settings]").forEach((el) => {
      el.removeEventListener("click", onReopen);
    });
  };
}
