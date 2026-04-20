import { gsap } from "gsap";

export function pinHeader() {
  const header = document.querySelector(".header");
  if (!header) return;

  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 50) {
        header.classList.add("is-pinned");
      } else {
        header.classList.remove("is-pinned");
      }
    },
    { passive: true },
  );
}

export function animateHeader() {
  const header = document.querySelector(".header");
  if (!header) return;

  const ctx = gsap.context(() => {
    const logo = header.querySelector(".header__logo");
    const contactBtn = header.querySelector(".btn--sm");
    const navLinks = header.querySelectorAll(".header__nav a");
    const services = header.querySelector(".header__link");

    if (!logo || !contactBtn) return;

    gsap.set([navLinks], { x: -40, opacity: 0 });
    gsap.set(services, { x: 40, opacity: 0 });

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
    });

    tl.from([logo, contactBtn], {
      y: 80,
      opacity: 0,
      duration: 0.9,
      stagger: 0.1,
    })
      .to(
        navLinks,
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
        },
        "-=0.4",
      )
      .to(
        services,
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
        },
        "<",
      );

    return tl;
  }, header);

  return () => ctx.revert();
}

// burger menu

const burger = document.querySelector(".burger");
const mobileMenu = document.querySelector(".mobile-menu");
const menuLinks = mobileMenu.querySelectorAll("a");
const closeBtn = document.querySelector(".mobile-menu__close");

function openMenu() {
  burger.classList.add("is-active");
  mobileMenu.classList.add("is-open");
  document.body.classList.add("menu-open");

  gsap.fromTo(
    menuLinks,
    { x: -100, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.5, stagger: 0.15, ease: "power2.out" },
  );
}

function closeMenu() {
  gsap.to(menuLinks, {
    x: 100,
    opacity: 0,
    duration: 0.3,
    stagger: 0.1,
    ease: "power2.in",
    onComplete: () => {
      burger.classList.remove("is-active");
      mobileMenu.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      gsap.set(menuLinks, { x: -100, opacity: 0 });
    },
  });
}

burger.addEventListener("click", openMenu);

menuLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

closeBtn.addEventListener("click", closeMenu);

mobileMenu.addEventListener("click", (e) => {
  if (e.target === mobileMenu) {
    closeMenu();
  }
});
// burger menu end
