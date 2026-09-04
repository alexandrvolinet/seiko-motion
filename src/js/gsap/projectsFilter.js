import { ScrollTrigger } from "gsap/ScrollTrigger";

const ALL = "all";

function getTags(card) {
  return (card.dataset.tags || "")
    .split("|")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function fillSelect(select, values) {
  const current = select.value || ALL;
  select.querySelectorAll("option:not([value='all'])").forEach((o) => o.remove());
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
  select.value = values.includes(current) ? current : ALL;
}

function readParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    industry: params.get("industry") || ALL,
    tag: params.get("tag") || ALL,
  };
}

function writeParams(industry, tag) {
  const url = new URL(window.location.href);
  if (industry === ALL) url.searchParams.delete("industry");
  else url.searchParams.set("industry", industry);
  if (tag === ALL) url.searchParams.delete("tag");
  else url.searchParams.set("tag", tag);
  window.history.replaceState(null, "", url);
}

const openDropdowns = new Set();

function closeAllDropdowns(except) {
  openDropdowns.forEach((api) => {
    if (api !== except) api.close();
  });
}

function setupCustomDropdown(select) {
  if (select.dataset.customized) return null;

  const filter = select.closest(".projects__filter");
  if (!filter) return null;
  select.dataset.customized = "true";

  const wrapper = document.createElement("div");
  wrapper.className = "projects__dropdown";
  select.after(wrapper);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "projects__dropdown-btn";
  button.setAttribute("aria-haspopup", "listbox");
  button.setAttribute("aria-expanded", "false");

  const valueSpan = document.createElement("span");
  valueSpan.className = "projects__dropdown-value";
  button.appendChild(valueSpan);
  wrapper.appendChild(button);

  const list = document.createElement("ul");
  list.className = "projects__dropdown-list";
  list.setAttribute("role", "listbox");
  list.hidden = true;
  wrapper.appendChild(list);

  select.hidden = true;

  let items = [];
  let highlightIndex = -1;

  const api = { select, button, list };

  function sync() {
    const selected = select.options[select.selectedIndex];
    valueSpan.textContent = selected ? selected.textContent : "";
    const optionValues = Array.from(select.options).map((o) => o.value);
    items.forEach((li, i) => {
      li.setAttribute("aria-selected", String(optionValues[i] === select.value));
    });
    highlightIndex = Math.max(0, optionValues.indexOf(select.value));
    setHighlight(highlightIndex);
  }

  function setHighlight(index) {
    highlightIndex = index;
    items.forEach((li, i) => li.classList.toggle("is-highlighted", i === index));
  }

  function open() {
    closeAllDropdowns(api);
    list.hidden = false;
    button.setAttribute("aria-expanded", "true");
    openDropdowns.add(api);
    setHighlight(highlightIndex >= 0 ? highlightIndex : 0);
    items[highlightIndex]?.focus({ preventScroll: true });
  }

  function close(refocusButton = false) {
    if (list.hidden) return;
    list.hidden = true;
    button.setAttribute("aria-expanded", "false");
    openDropdowns.delete(api);
    if (refocusButton) button.focus();
  }

  function rebuild() {
    list.replaceChildren();
    items = Array.from(select.options).map((option) => {
      const li = document.createElement("li");
      li.className = "projects__dropdown-option";
      li.setAttribute("role", "option");
      li.setAttribute("tabindex", "-1");
      li.dataset.value = option.value;
      li.textContent = option.textContent;
      li.addEventListener("click", () => choose(option.value));
      li.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          moveHighlight(1);
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          moveHighlight(-1);
        } else if (event.key === "Home") {
          event.preventDefault();
          setHighlight(0);
          items[0]?.focus();
        } else if (event.key === "End") {
          event.preventDefault();
          setHighlight(items.length - 1);
          items[items.length - 1]?.focus();
        } else if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          choose(li.dataset.value);
        } else if (event.key === "Escape") {
          event.preventDefault();
          close(true);
        } else if (event.key === "Tab") {
          close();
        }
      });
      li.addEventListener("pointerenter", () => {
        setHighlight(items.indexOf(li));
      });
      list.appendChild(li);
      return li;
    });
    sync();
  }

  function moveHighlight(delta) {
    if (!items.length) return;
    const next = (highlightIndex + delta + items.length) % items.length;
    setHighlight(next);
    items[next]?.focus();
  }

  function choose(value) {
    select.value = value;
    sync();
    close();
    button.focus();
    select.dispatchEvent(new Event("change", { bubbles: true }));
  }

  button.addEventListener("click", () => {
    if (list.hidden) open();
    else close();
  });

  button.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (list.hidden) open();
    } else if (event.key === "Escape") {
      close();
    }
  });

  document.addEventListener("pointerdown", (event) => {
    if (!wrapper.contains(event.target)) close();
  });

  api.open = open;
  api.close = close;
  api.rebuild = rebuild;
  api.sync = sync;

  rebuild();
  return api;
}

export function initProjectsFilter() {
  const grid = document.querySelector('[data-projects-grid][data-projects-mode="archive"]');
  if (!grid) return () => {};

  const cards = Array.from(grid.querySelectorAll(".project-card"));
  if (!cards.length) return () => {};

  const toolbar = document.querySelector("[data-projects-filters]");
  const industrySelect = toolbar?.querySelector('[data-filter="industry"]');
  const tagSelect = toolbar?.querySelector('[data-filter="tag"]');
  const resetBtn = toolbar?.querySelector("[data-filter-reset]");
  const countEl = document.querySelector("[data-filter-count]");
  const emptyEl = document.querySelector("[data-projects-empty]");
  if (!industrySelect || !tagSelect) return () => {};

  const industries = [...new Set(cards.map((c) => (c.dataset.industry || "").trim()).filter(Boolean))].sort();
  const tags = [...new Set(cards.flatMap(getTags))].sort();
  fillSelect(industrySelect, industries);
  fillSelect(tagSelect, tags);

  const industryDropdown = setupCustomDropdown(industrySelect);
  const tagDropdown = setupCustomDropdown(tagSelect);
  const dropdowns = [industryDropdown, tagDropdown].filter(Boolean);

  const syncDropdowns = () => dropdowns.forEach((d) => d.sync());

  const apply = () => {
    const industry = industrySelect.value || ALL;
    const tag = tagSelect.value || ALL;
    let visible = 0;

    cards.forEach((card) => {
      const matchesIndustry = industry === ALL || (card.dataset.industry || "").trim() === industry;
      const matchesTag = tag === ALL || getTags(card).includes(tag);
      const show = matchesIndustry && matchesTag;
      card.hidden = !show;
      if (show) visible += 1;
    });

    const isFiltered = industry !== ALL || tag !== ALL;
    if (resetBtn) resetBtn.hidden = !isFiltered;
    if (emptyEl) emptyEl.hidden = visible !== 0;
    if (countEl) {
      countEl.textContent = isFiltered
        ? `Showing ${visible} of ${cards.length} projects`
        : "";
    }

    writeParams(industry, tag);
    ScrollTrigger.refresh();
  };

  const onReset = () => {
    industrySelect.value = ALL;
    tagSelect.value = ALL;
    syncDropdowns();
    apply();
  };

  industrySelect.addEventListener("change", apply);
  tagSelect.addEventListener("change", apply);
  resetBtn?.addEventListener("click", onReset);

  const initial = readParams();
  if (industries.includes(initial.industry)) industrySelect.value = initial.industry;
  if (tags.includes(initial.tag)) tagSelect.value = initial.tag;
  syncDropdowns();
  apply();

  return () => {
    industrySelect.removeEventListener("change", apply);
    tagSelect.removeEventListener("change", apply);
    resetBtn?.removeEventListener("click", onReset);
  };
}
