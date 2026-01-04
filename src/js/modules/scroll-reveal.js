(function (global) {
  const ATTRIBUTE = "data-animate-on-scroll";
  const READY_CLASS = "is-reveal-ready";
  const VISIBLE_CLASS = "is-visible";

  function initScrollReveal() {
    const elements = document.querySelectorAll(`[${ATTRIBUTE}]`);
    if (!elements.length) return;

    const supportsMatchMedia = typeof window.matchMedia === "function";
    const prefersReducedMotion = supportsMatchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      elements.forEach((el) => {
        el.classList.remove(READY_CLASS);
        el.classList.add(VISIBLE_CLASS);
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove(READY_CLASS);
            entry.target.classList.add(VISIBLE_CLASS);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 },
    );

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
      const isInViewport = rect.top < viewportHeight && rect.bottom > 0 && rect.left < viewportWidth && rect.right > 0;

      if (!isInViewport) {
        el.classList.add(READY_CLASS);
      }

      // Delay can be configured via data attribute
      const delay = Number(el.getAttribute(ATTRIBUTE)) || 0;
      if (delay > 0) {
        el.style.setProperty("--scroll-reveal-delay", `${delay}ms`);
      }

      observer.observe(el);

      if (isInViewport) {
        el.classList.add(VISIBLE_CLASS);
        el.classList.remove(READY_CLASS);
        observer.unobserve(el);
      }
    });
  }

  global.SiteFeatureModules = global.SiteFeatureModules || [];
  global.SiteFeatureModules.push({ name: "scrollReveal", init: initScrollReveal });
})(window);
