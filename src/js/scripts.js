// Import modules to ensure they register before we run initializers
import "./modules/terminal-typing.js";
import { initHeroDots } from "./modules/dot-magnet.js";
import { initAvatarTilt } from "./modules/avatar-tilt.js";
import { initComponents } from "./components/ui.js";

(function (global) {
  function initModule(module) {
    try {
      if (module && typeof module.init === "function") {
        module.init();
      }
    } catch (error) {
      console.error(`Failed to initialise module "${(module && module.name) || "unknown"}"`, error);
    }
  }

  function runInitialisers() {
    // Process data-button and data-badge attributes
    initComponents();

    // Vite's production build bundles each page's scripts into one module and
    // evaluates this shared file first, so some feature modules (accordion,
    // contact form) register *after* this runs. Init the ones already here,
    // then make later registrations init immediately.
    const modules = (global.SiteFeatureModules = global.SiteFeatureModules || []);
    modules.forEach(initModule);
    modules.push = function (...items) {
      items.forEach(initModule);
      return Array.prototype.push.apply(this, items);
    };

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
