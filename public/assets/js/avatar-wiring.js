// avatar-wiring.js
(function () {
  const btn = document.getElementById("avatar-play-btn");
  if (!btn) return;
  btn.addEventListener("click", async function () {
    btn.disabled = true;
    btn.classList.add("opacity-60", "pointer-events-none");
    try {
      if (window.__avatarPlayer && typeof window.__avatarPlayer.playOnce === "function") {
        await window.__avatarPlayer.playOnce();
      }
    } catch (e) {
      console.error(e);
    }
    btn.disabled = false;
    btn.classList.remove("opacity-60", "pointer-events-none");
  });
  btn.setAttribute("aria-live", "polite");
})();
