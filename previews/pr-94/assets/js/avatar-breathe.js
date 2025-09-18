// avatar-breathe.js
// Procedural motion driver for the CSS/SVG hyper-real avatar.

(function () {
  const root = document.getElementById("avatar-sprite");
  if (!root) return;

  const state = {
    rafId: null,
    pointerX: 0,
    pointerY: 0,
    targetX: 0,
    targetY: 0,
    reduceMotion: false,
  };

  const reduceQuery =
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;

  if (reduceQuery) {
    state.reduceMotion = reduceQuery.matches;
    reduceQuery.addEventListener("change", (event) => {
      state.reduceMotion = event.matches;
      if (state.reduceMotion) {
        stop();
      } else {
        applyStaticState();
        start();
      }
    });
  }

  function applyStaticState() {
    root.style.setProperty("--avatar-tilt-x", "0deg");
    root.style.setProperty("--avatar-tilt-y", "0deg");
    root.style.setProperty("--avatar-translate", "0px");
    root.style.setProperty("--avatar-glow-strength", "0.55");
    root.style.setProperty("--avatar-highlight", "48%");
  }

  function animate(now) {
    if (state.reduceMotion) {
      stop();
      return;
    }

    state.pointerX += (state.targetX - state.pointerX) * 0.08;
    state.pointerY += (state.targetY - state.pointerY) * 0.08;

    const seconds = now / 1000;
    const tiltX = (state.pointerX * 7).toFixed(3);
    const tiltY = (-state.pointerY * 7).toFixed(3);
    const float = Math.sin(seconds * 1.2) * 6;
    const glow = 0.5 + (Math.sin(seconds * 0.9) + 1) * 0.22;
    const highlight = 44 + (Math.sin(seconds * 1.7) + 1) * 6;

    root.style.setProperty("--avatar-tilt-x", `${tiltX}deg`);
    root.style.setProperty("--avatar-tilt-y", `${tiltY}deg`);
    root.style.setProperty("--avatar-translate", `${float.toFixed(2)}px`);
    root.style.setProperty("--avatar-glow-strength", glow.toFixed(3));
    root.style.setProperty("--avatar-highlight", `${highlight.toFixed(2)}%`);

    state.rafId = requestAnimationFrame(animate);
  }

  function start() {
    if (state.rafId !== null || state.reduceMotion) return;
    state.rafId = requestAnimationFrame(animate);
  }

  function stop() {
    if (state.rafId !== null) {
      cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }
    applyStaticState();
  }

  function clamp(value) {
    if (value < -1) return -1;
    if (value > 1) return 1;
    return value;
  }

  function updatePointer(event) {
    if (state.reduceMotion) return;
    const rect = root.getBoundingClientRect();
    const width = rect.width || 1;
    const height = rect.height || 1;
    const relativeX = (event.clientX - rect.left) / width - 0.5;
    const relativeY = (event.clientY - rect.top) / height - 0.5;
    state.targetX = clamp(relativeX * 2);
    state.targetY = clamp(relativeY * 2);
  }

  function resetPointer() {
    state.targetX = 0;
    state.targetY = 0;
  }

  root.addEventListener("pointermove", updatePointer);
  root.addEventListener("pointerdown", updatePointer);
  root.addEventListener("pointerup", resetPointer);
  root.addEventListener("pointerleave", resetPointer);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stop();
    } else {
      applyStaticState();
      start();
    }
  });

  window.addEventListener("beforeunload", stop);

  applyStaticState();
  start();

  window.__avatarPlayer = {
    playOnce: () => Promise.resolve(),
    stop,
    preloadAll: () => Promise.resolve(),
  };
})();
