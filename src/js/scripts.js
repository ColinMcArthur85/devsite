(function (global) {
  function runInitialisers() {
    const modules = global.SiteFeatureModules || [];
    modules.forEach((module) => {
      try {
        if (typeof module.init === "function") {
          module.init();
        }
      } catch (error) {
        console.error(`Failed to initialise module "${module.name || "unknown"}"`, error);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runInitialisers, { once: true });
  } else {
    runInitialisers();
  }
})(window);
