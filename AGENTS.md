# AGENTS.md - SeikoMotions Landing Page

## Project Overview

This is a Vite-powered landing page for SeikoMotions (motion design studio) using vanilla JavaScript with GSAP animations and Sass for styling.

## Build Commands

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

**Note:** No test framework is currently configured. If adding tests, use Vitest for this Vite project.

---

## Code Style Guidelines

### General Principles

- Keep files small and focused (single responsibility)
- Use meaningful, descriptive names
- Comment complex logic only (avoid obvious comments)
- Delete commented-out code before committing

### JavaScript Conventions

**File Organization:**
- Entry point: `src/js/main.js`
- GSAP animations: `src/js/gsap/` (modular by section)
- Use ES modules with explicit named exports

**Naming:**
- Functions: `camelCase` (e.g., `animateHeader`, `closeMenu`)
- Constants: `UPPER_SNAKE_CASE` for true constants
- Variables: `camelCase`, prefer const over let
- DOM elements: descriptive names with prefix (e.g., `burger`, `mobileMenu`, `faqItems`)

**Imports:**
```javascript
// Absolute imports from package
import { gsap } from "gsap";

// Relative imports (use explicit paths)
import { animateHeader } from "./gsap/page.js";
import "../scss/main.scss";
```

**GSAP Patterns:**
```javascript
// Always use gsap.context() for cleanup in components
export function animateHeader() {
  const header = document.querySelector(".header");
  if (!header) return;

  const ctx = gsap.context(() => {
    // animations here
  }, header);

  return () => ctx.revert();
}

// Use timelines with defaults
const tl = gsap.timeline({
  defaults: { ease: "power2.out" }
});
```

**Error Handling:**
- Guard clauses for missing DOM elements
- Always check if element exists before animating
```javascript
const header = document.querySelector(".header");
if (!header) return;
```

**Event Listeners:**
- Use named functions for event listeners that may need removal
- Add accessibility attributes (aria-label, aria-expanded)

### SCSS Conventions

**File Structure (7-1 Pattern):**
```
src/scss/
├── main.scss           # Entry point (uses @use)
├── abstracts/          # Variables, mixins, functions
├── base/               # Reset, fonts, base styles
├── components/         # Reusable UI components
├── layout/             # Header, footer, container
└── sections/           # Page section styles
```

**Import Order (in main.scss):**
```scss
@use 'abstracts/animations';
@use 'abstracts/layout';
@use 'abstracts/mixins';
@use 'abstracts/variables';

@use 'base/base';
@use 'base/fonts';
@use 'base/reset';

@use 'components/loader';
@use 'components/badges';
@use 'components/buttons';

@use 'layout/container';
@use 'layout/footer';
@use 'layout/header';

@use 'sections/hero';
@use 'sections/services';
// ... more sections
```

**Naming (BEM-like):**
- Block: `.header`, `.faq`, `.card`
- Element: `.header__logo`, `.faq__question`, `.card__background`
- Modifier: `.btn--sm`, `.faq__item.is-open`, `.stats__card--first`

**CSS Variables:**
- Define in `:root` in `abstracts/_variables.scss`
- Use semantic names: `--color-bg`, `--font-primary`, `--container-max-width`

**Mixins:**
- Keep mixins simple and focused
- Use for responsive breakpoints:
```scss
@mixin respond($breakpoint) {
  @if $breakpoint == mobile {
    @media (max-width: 440px) { @content; }
  }
  @if $breakpoint == tablet {
    @media (max-width: 991px) { @content; }
  }
}
```

**Sass Syntax:**
- Use modern `@use` instead of `@import`
- Use `@forward` in partials index files if needed
- Nest selectors moderately (max 3 levels deep)

### HTML Conventions

**Structure:**
- Use semantic HTML5 elements (`<header>`, `<main>`, `<section>`, `<nav>`, `<footer>`)
- Always include `lang` attribute on `<html>`
- Include meta viewport for responsiveness

**Classes:**
- Match BEM-like naming from SCSS
- Use utility classes sparingly
- Include alt text on all images

**Accessibility:**
- Add `aria-label` to icon-only buttons
- Use `<button>` for actions, `<a>` for links
- Include proper heading hierarchy (single h1 per page)

### Asset Organization

```
src/assets/
├── fonts/           # Font files (Azonix, Syne)
├── icons/           # SVG icons
├── images/          # Raster images (PNG, JPG)
└── videos/          # Video files
```

**Images in HTML:**
```html
<img
  src="./src/assets/images/logo.svg"
  alt="Seiko motion"
  width="135"
  height="36"
/>
```

---

## Common Tasks

### Adding a New Section

1. Create SCSS file in `src/scss/sections/`
2. Add to `main.scss` imports
3. Add HTML in `index.html` with proper classes
4. Create GSAP animation in `src/js/gsap/` if needed
5. Import and call animation in `main.js`

### Adding a New Component

1. Create SCSS file in `src/scss/components/`
2. Use BEM naming
3. Add to `main.scss` imports

### Modifying Styles

1. Find the relevant section/component file in `src/scss/`
2. Use CSS variables from `abstracts/_variables.scss` when available
3. Use mixins for responsive behavior

---

## Notes

- This is a landing page (static site), not a SPA
- GSAP animations are triggered on `window.load` event
- The loader hides before animations start
- Mobile menu uses class-based toggle (`is-open`, `is-active`)
