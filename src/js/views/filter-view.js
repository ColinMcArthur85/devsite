import { createBadge } from '../components/ui.js';

export function FilterView(container, group, onToggle) {
  const handleClick = (event) => {
    const badge = event.target.closest("[data-filter-value]");
    if (!badge) return;
    const value = badge.dataset.filterValue;
    badge.classList.toggle("is-active");

    badge.setAttribute("aria-pressed", badge.classList.contains("is-active") ? "true" : "false");
    onToggle(value, badge.classList.contains("is-active"));
  };

  container.addEventListener("click", handleClick);

  return {
    render(items, filterState) {
      container.innerHTML = "";
      items.forEach((item) => {
        const badge = createBadge({
          text: item,
          appearance: "solid",
          classes: "filter-pill",
        });
        badge.dataset.filterGroup = group;
        badge.dataset.filterValue = item;
        const isActive = filterState.isActive(group, item);
        badge.classList.toggle("is-active", isActive);
        badge.setAttribute("role", "switch");
        badge.setAttribute("aria-pressed", isActive ? "true" : "false");
        container.appendChild(badge);
      });
    },
  };
}
