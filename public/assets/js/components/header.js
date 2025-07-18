document.addEventListener("DOMContentLoaded", () => {
  const inPagesDir = window.location.pathname.includes("/pages/");
  const basePath = inPagesDir ? "../" : "./";

  // === Load the menu ===
  fetch(`${basePath}components/menu.html`)
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("menu-container").innerHTML = html;

      if (inPagesDir) {
        document.querySelectorAll("#menu-container a[href]").forEach((link) => {
          const href = link.getAttribute("href");
          if (!href || href.startsWith("http") || href.startsWith("#")) return;
          if (href.startsWith("pages/")) {
            link.setAttribute("href", href.replace("pages/", ""));
          } else {
            link.setAttribute("href", `../${href}`);
          }
        });
      }

      initMenu();
    });

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
