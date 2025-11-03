(function () {
  function armBoops() {
    document.querySelectorAll(".boop").forEach((node) => {
      const restart = () => {
        node.classList.remove("is-booping");
        // Force reflow so the animation can be retriggered consistently
        void node.offsetWidth;
        node.classList.add("is-booping");
      };

      node.addEventListener("mouseenter", restart);
      node.addEventListener("focus", restart);
      node.addEventListener("animationend", () => {
        node.classList.remove("is-booping");
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", armBoops, { once: true });
  } else {
    armBoops();
  }
})();
