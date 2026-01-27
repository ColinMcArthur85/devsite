// Import modules to ensure they register before we run initializers
import "./modules/terminal-typing.js";
import { initHeroDots } from "./modules/dot-magnet.js";
import { initAvatarTilt } from "./modules/avatar-tilt.js";
import { initComponents } from "./components/ui.js";

(function (global) {
  function runInitialisers() {
    // Process data-button and data-badge attributes
    initComponents();

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
    
    // Initialize hero dots magnet effect
    initHeroDots();

    // Initialize 3D Avatar Tilt
    initAvatarTilt();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runInitialisers, { once: true });
  } else {
    runInitialisers();
  }
})(window);
