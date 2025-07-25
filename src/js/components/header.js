document.addEventListener("DOMContentLoaded", () => {
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

      document.getElementById("menu-container").innerHTML = processedHtml;
      initMenu();
    })
    .catch((err) => console.error("Failed to load menu", err));

  function initMenu() {
    // === Theme Toggle ===
    const htmlEl = document.documentElement;
    const themeToggle = document.getElementById("themeToggle");
    const icon = themeToggle?.querySelector("i");
    const themeMeta = document.querySelector('meta[name="theme-color"]');

    const setTheme = (isDark) => {
      htmlEl.classList.toggle("dark", isDark);
      localStorage.setItem("theme", isDark ? "dark" : "light");
      themeMeta?.setAttribute("content", isDark ? "#000000" : "#0070f3");
      icon?.classList.replace(isDark ? "fa-moon" : "fa-sun", isDark ? "fa-sun" : "fa-moon");
      themeToggle?.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    };

    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setTheme(true);
    }

    themeToggle?.addEventListener("click", () => {
      const isDark = !htmlEl.classList.contains("dark");
      setTheme(isDark);
    });

    // === Mobile navigation toggle ===
    const menuToggle = document.getElementById("menuToggle");
    const closeMenu = document.getElementById("closeMenu");
    const mobileMenu = document.getElementById("mobileMenu");
    const header = document.querySelector("header");

    if (menuToggle && closeMenu && mobileMenu) {
      menuToggle.addEventListener("click", () => {
        mobileMenu.classList.remove("translate-x-full");
        document.body.classList.add("overflow-hidden");
      });

      closeMenu.addEventListener("click", () => {
        mobileMenu.classList.add("translate-x-full");
        document.body.classList.remove("overflow-hidden");
      });

      const mobileLinks = mobileMenu.querySelectorAll("a");
      mobileLinks.forEach((link) => {
        link.addEventListener("click", () => {
          mobileMenu.classList.add("translate-x-full");
          document.body.classList.remove("overflow-hidden");
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
});
