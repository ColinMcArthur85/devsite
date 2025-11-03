(function (global) {
  const ATTRIBUTE = "data-animate-on-scroll";
  const VISIBLE_CLASS = "is-visible";

  function initScrollReveal() {
    const elements = document.querySelectorAll(`[${ATTRIBUTE}]`);
    if (!elements.length) return;

    const supportsMatchMedia = typeof window.matchMedia === "function";
    const prefersReducedMotion = supportsMatchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      elements.forEach((el) => el.classList.add(VISIBLE_CLASS));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(VISIBLE_CLASS);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    elements.forEach((el) => {
      // Delay can be configured via data attribute
      const delay = Number(el.getAttribute(ATTRIBUTE)) || 0;
      if (delay > 0) {
        el.style.setProperty("--scroll-reveal-delay", `${delay}ms`);
      }
      observer.observe(el);
    });
  }

  global.SiteFeatureModules = global.SiteFeatureModules || [];
  global.SiteFeatureModules.push({ name: "scrollReveal", init: initScrollReveal });
})(window);
