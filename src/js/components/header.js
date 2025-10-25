(() => {
  const PLACEHOLDER_HEIGHT = "clamp(5.75rem, 8vw, 6.75rem)";

  const ensureMenuContainer = () => {
    const menuContainer = document.getElementById("menu-container");
    if (menuContainer) {
      if (!menuContainer.style.minHeight) {
        menuContainer.style.minHeight = PLACEHOLDER_HEIGHT;
      }
      if (!menuContainer.style.display) {
        menuContainer.style.display = "block";
      }
    }
    return menuContainer;
  };

  const loadMenu = () => {
    const menuContainer = ensureMenuContainer();
    if (!menuContainer) return;

    // === Load the menu ===
    const scriptEl = document.currentScript || document.querySelector('script[src*="header.js"]');
    let menuPath = "/components/menu.html";
    if (scriptEl) {
      const scriptUrl = new URL(scriptEl.src, window.location.href);
      const basePath = scriptUrl.pathname.replace(/\/assets\/js\/components\/header\.js$/, "");
      menuPath = `${scriptUrl.origin}${basePath}/components/menu.html`;
    }

    fetch(menuPath)
      .catch(() => fetch("/components/menu.html"))
      .then((response) => response.text())
      .then((html) => {
        // Calculate the correct base path based on current page location
        const currentPath = window.location.pathname;
        let basePath = "";

        // Determine depth and set appropriate base path
        if (currentPath === "/" || (currentPath.endsWith("/index.html") && !currentPath.includes("/projects/"))) {
          // Root level pages (but not project index pages)
          basePath = "./";
        } else if (currentPath.includes("/pages/")) {
          // Pages in /pages/ folder
          basePath = "../";
        } else if (currentPath.includes("/projects/")) {
          // Pages in /projects/ folder - need to go up to root
          // Count the number of slashes after /projects/
          const projectsIndex = currentPath.indexOf("/projects/");
          const pathAfterProjects = currentPath.substring(projectsIndex + "/projects/".length);
          const slashCount = (pathAfterProjects.match(/\//g) || []).length;

          // If we're in /public/projects/..., we need to account for that extra level
          const hasPublicPrefix = currentPath.startsWith("/public/");

          if (hasPublicPrefix) {
            // We need to go back to /public/ directory, not to server root
            const depth = slashCount + 1; // +1 to get back from /projects/ to /public/
            basePath = "../".repeat(depth);
          } else {
            // Normal projects path handling
            const depth = slashCount + 1;
            basePath = "../".repeat(depth);
          }
        } else {
          // Default fallback
          basePath = "./";
        }

        // Replace placeholder with calculated base path
        const processedHtml = html.replace(/\{\{BASE_PATH\}\}/g, basePath);

        menuContainer.innerHTML = processedHtml;
        menuContainer.dataset.loaded = "true";
        menuContainer.style.minHeight = "";
        menuContainer.style.display = "";
        initMenu();
      })
      .catch((err) => console.error("Failed to load menu", err));
  };

  const initWhenReady = () => {
    if (document.readyState === "loading") {
      ensureMenuContainer();
      document.addEventListener("DOMContentLoaded", loadMenu, { once: true });
    } else {
      loadMenu();
    }
  };

  initWhenReady();

  function initMenu() {
    // === Theme Toggle ===
    const htmlEl = document.documentElement;
    const themeToggle = document.getElementById("themeToggle");
    const icon = themeToggle?.querySelector("i");
    const themeMeta = document.querySelector('meta[name="theme-color"]');

    // Apply theme: default to dark unless user explicitly chose light.
    const setTheme = (isDark) => {
      htmlEl.classList.toggle("dark", isDark);
      // Persist only when user explicitly chooses light. Do NOT persist dark as default.
      try {
        if (isDark) {
          // user chose dark -> remove any persisted preference so default remains dark for new visitors
          localStorage.removeItem("theme");
        } else {
          // user chose light -> persist that choice
          localStorage.setItem("theme", "light");
        }
      } catch (e) {}
      themeMeta?.setAttribute("content", isDark ? "#000000" : "#0070f3");
      icon?.classList.replace(isDark ? "fa-moon" : "fa-sun", isDark ? "fa-sun" : "fa-moon");
      themeToggle?.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    };

    const savedTheme = localStorage.getItem("theme");
    // Default: dark for everyone unless they previously selected 'light'
    if (savedTheme === "light") {
      setTheme(false);
    } else {
      setTheme(true);
    }

    themeToggle?.addEventListener("click", () => {
      const isDarkNow = htmlEl.classList.contains("dark");
      // toggle: if currently dark -> switch to light (isDark=false), else switch to dark
      setTheme(!isDarkNow);
    });

    // === Mobile navigation toggle ===
    const menuToggle = document.getElementById("menuToggle");
    const closeMenu = document.getElementById("closeMenu");
    const mobileMenu = document.getElementById("mobileMenu");
    const header = document.querySelector("header");

    if (menuToggle && closeMenu && mobileMenu) {
      // Use an "is-open" class with transform/opacity transitions for a smooth entrance
      const openMenu = () => {
        // ensure element is visible for transition
        mobileMenu.classList.remove("translate-x-full", "hidden");
        // force a reflow so the next class addition triggers the transition
        void mobileMenu.offsetWidth;
        mobileMenu.classList.add("is-open");
        menuToggle.classList.add("is-active");
        document.body.classList.add("overflow-hidden");
        menuToggle.setAttribute("aria-expanded", "true");
      };

      const closeMenuFn = () => {
        mobileMenu.classList.remove("is-open");
        menuToggle.classList.remove("is-active");
        menuToggle.setAttribute("aria-expanded", "false");
        // after transition, hide off-screen to remove from tab order
        const onEnd = (e) => {
          if (e.target === mobileMenu) {
            mobileMenu.classList.add("translate-x-full");
            document.body.classList.remove("overflow-hidden");
            mobileMenu.removeEventListener("transitionend", onEnd);
          }
        };
        mobileMenu.addEventListener("transitionend", onEnd);
      };

      menuToggle.addEventListener("click", () => {
        if (mobileMenu.classList.contains("is-open")) closeMenuFn();
        else openMenu();
      });

      closeMenu.addEventListener("click", closeMenuFn);

      const mobileLinks = mobileMenu.querySelectorAll("a");
      mobileLinks.forEach((link) => {
        link.addEventListener("click", () => {
          closeMenuFn();
        });
      });
    }

    // === Smooth Scrolling for Anchor Links ===
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const targetElement = document.querySelector(this.getAttribute("href"));
        if (targetElement) {
          e.preventDefault();
          const headerHeight = header?.offsetHeight || 0;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          window.scrollTo({ top: targetPosition, behavior: "smooth" });
        }
      });
    });

    // === Add Header Shadow When Scrolling ===
    window.addEventListener("scroll", () => {
      if (header) {
        header.classList.toggle("shadow-md", window.scrollY > 0);
      }
    });
  }
})();
