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
    bounds: null,
    boundsDirty: true,
    lastPointerPosition: null,
    pointerUpdateFrame: null,
  };

  let resizeObserver = null;
  let removeResizeHandler = null;

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

  const markBoundsDirty = () => {
    state.boundsDirty = true;
  };

  const ensureBounds = () => {
    if (!state.bounds || state.boundsDirty) {
      state.bounds = root.getBoundingClientRect();
      state.boundsDirty = false;
    }
  };

  if (typeof ResizeObserver === "function") {
    resizeObserver = new ResizeObserver(markBoundsDirty);
    resizeObserver.observe(root);
  } else {
    const resizeHandler = () => markBoundsDirty();
    window.addEventListener("resize", resizeHandler);
    removeResizeHandler = () => window.removeEventListener("resize", resizeHandler);
  }

  const scrollHandler = () => markBoundsDirty();
  window.addEventListener("scroll", scrollHandler, { passive: true });
  window.addEventListener("load", markBoundsDirty, { once: true });

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
    if (state.pointerUpdateFrame !== null) {
      cancelAnimationFrame(state.pointerUpdateFrame);
      state.pointerUpdateFrame = null;
    }
    applyStaticState();
  }

  function clamp(value) {
    if (value < -1) return -1;
    if (value > 1) return 1;
    return value;
  }

  function processPointerUpdate() {
    const position = state.lastPointerPosition;
    state.pointerUpdateFrame = null;

    if (state.reduceMotion || !position) return;

    ensureBounds();

    const bounds = state.bounds;
    const width = bounds?.width || 1;
    const height = bounds?.height || 1;
    const relativeX = (position.clientX - bounds.left) / width - 0.5;
    const relativeY = (position.clientY - bounds.top) / height - 0.5;

    state.targetX = clamp(relativeX * 2);
    state.targetY = clamp(relativeY * 2);
  }

  function queuePointerUpdate(event) {
    if (state.reduceMotion) return;
    state.lastPointerPosition = { clientX: event.clientX, clientY: event.clientY };
    if (state.pointerUpdateFrame !== null) return;
    state.pointerUpdateFrame = requestAnimationFrame(processPointerUpdate);
  }

  function resetPointer() {
    state.targetX = 0;
    state.targetY = 0;
    state.lastPointerPosition = null;
    if (state.pointerUpdateFrame !== null) {
      cancelAnimationFrame(state.pointerUpdateFrame);
      state.pointerUpdateFrame = null;
    }
  }

  root.addEventListener("pointermove", queuePointerUpdate);
  root.addEventListener("pointerdown", queuePointerUpdate);
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

  window.addEventListener("beforeunload", () => {
    stop();
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    if (removeResizeHandler) {
      removeResizeHandler();
      removeResizeHandler = null;
    }
    window.removeEventListener("scroll", scrollHandler);
  });

  applyStaticState();
  start();

  window.__avatarPlayer = {
    playOnce: () => Promise.resolve(),
    stop,
    preloadAll: () => Promise.resolve(),
  };
})();
