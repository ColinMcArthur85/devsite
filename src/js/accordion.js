(function (global) {
  function initAccordions() {
    const headings = document.querySelectorAll("[data-skill-accordion] .skill-heading, .skill-accordion .skill-heading");
    headings.forEach((heading) => {
      const list = heading.nextElementSibling;
      if (!list || list.tagName !== "UL") return;

      heading.setAttribute("role", "button");
      heading.setAttribute("tabindex", "0");
      heading.setAttribute("aria-expanded", heading.classList.contains("is-open") ? "true" : "false");
      list.classList.add("skill-list");

      const toggle = () => {
        const isOpen = heading.classList.toggle("is-open");
        list.classList.toggle("is-open", isOpen);
        heading.setAttribute("aria-expanded", isOpen ? "true" : "false");
      };

      heading.addEventListener("click", toggle);
      heading.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggle();
        }
      });
    });
  }

  global.SiteFeatureModules = global.SiteFeatureModules || [];
  global.SiteFeatureModules.push({ name: "accordion", init: initAccordions });
})(window);
