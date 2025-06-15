document.addEventListener("DOMContentLoaded", () => {
  fetch("components/menu.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load menu component");
      }
      return response.text();
    })
    .then((html) => {
      document.getElementById("menu-container").innerHTML = html;

      // Add event listeners for mobile menu toggle
      const menuToggle = document.getElementById("menuToggle");
      const closeMenu = document.getElementById("closeMenu");
      const mobileMenu = document.getElementById("mobileMenu");

      menuToggle?.addEventListener("click", () => {
        mobileMenu.classList.remove("translate-x-full");
      });

      closeMenu?.addEventListener("click", () => {
        mobileMenu.classList.add("translate-x-full");
      });
    })
    .catch((error) => console.error("Error loading menu:", error));
});
