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

import menuHtml from '../../components/menu.html?raw';

const loadMenu = () => {
  const menuContainer = ensureMenuContainer();
  if (!menuContainer) return;

  // === Load the menu ===
  // In Vite, we import the HTML directly
  let html = menuHtml;

  // Fallback: if fetched menu is missing mobile nav links (empty <ul>), inject a default set.
  const hasMobileLinks = /mobile-nav-link/.test(html);
  if (!hasMobileLinks) {
    console.warn("[menu] mobile-nav-link anchors missing in fetched menu.html; injecting fallback nav items.");
    html = html.replace(/<ul class=\"mt-16[\s\S]*?<\/ul>/, (match) => {
      const basePath = "{{BASE_PATH}}"; // placeholder; replaced later
      return `<ul class="mt-16 flex flex-1 flex-col items-center justify-center gap-8 text-center">
  <li><a href="${basePath}index.html" class="mobile-nav-link">Home</a></li>
  <li><a href="${basePath}pages/about.html" class="mobile-nav-link">About</a></li>
  <li><a href="${basePath}pages/skills.html" class="mobile-nav-link">Skills</a></li>
  <li><a href="${basePath}pages/projects.html" class="mobile-nav-link">Projects</a></li>
  <li><a href="${basePath}pages/contact.html" class="mobile-nav-link">Contact</a></li>
</ul>`;
    });
  }
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
  // Runtime DOM-level fallback: ensure mobile menu has nav items even if HTML replacement failed.
  try {
    const mobileUl = menuContainer.querySelector("[data-mobile-menu] ul");
    if (mobileUl && mobileUl.querySelectorAll("li").length === 0) {
      const items = [
        { href: basePath + "index.html", label: "Home" },
        { href: basePath + "pages/about.html", label: "About" },
        { href: basePath + "pages/skills.html", label: "Skills" },
        { href: basePath + "pages/projects.html", label: "Projects" },
        { href: basePath + "pages/contact.html", label: "Contact" },
      ];
      items.forEach((item) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = item.href;
        a.textContent = item.label;
        a.className = "mobile-nav-link";
        li.appendChild(a);
        mobileUl.appendChild(li);
      });
      console.warn("[menu] Injected runtime fallback mobile nav items");
    }
  } catch (e) {
    console.error("[menu] mobile nav fallback failed", e);
  }
  menuContainer.dataset.loaded = "true";
  menuContainer.style.minHeight = "";
  menuContainer.style.display = "";
  initMenu();
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
  const iconUse = themeToggle?.querySelector("use");
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  // Compute a base path for icons based on current location (mirrors menu BASE_PATH logic)
  const getBasePath = () => {
    const currentPath = window.location.pathname;
    let basePath = "";

    if (currentPath === "/" || (currentPath.endsWith("/index.html") && !currentPath.includes("/projects/"))) {
      basePath = "./";
    } else if (currentPath.includes("/pages/")) {
      basePath = "../";
    } else if (currentPath.includes("/projects/")) {
      const projectsIndex = currentPath.indexOf("/projects/");
      const pathAfterProjects = currentPath.substring(projectsIndex + "/projects/".length);
      const slashCount = (pathAfterProjects.match(/\//g) || []).length;
      const hasPublicPrefix = currentPath.startsWith("/public/");
      const depth = slashCount + 1; // back from /projects/ to its parent
      basePath = "../".repeat(depth);
      if (hasPublicPrefix && basePath === "") basePath = "./";
    } else {
      basePath = "./";
    }
    return basePath;
  };
  const basePathForIcons = getBasePath();

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
    iconUse?.setAttribute("href", `${basePathForIcons}assets/icons/sprite.svg#${isDark ? "sun" : "moon"}`);
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
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const closeMenu = document.querySelector("[data-menu-close]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
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
