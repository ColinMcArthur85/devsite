// avatar-breathe.js
// Simple frame player for a breathing avatar sequence.

(function () {
  const el = document.getElementById("avatar-sprite");
  if (!el) return;

  // Configuration
  const folder = "./assets/images/sprites/avatar_animation/neutral/compressed/";
  const prefix = "frame_";
  const ext = ".webp";
  const frameCount = 210;
  const fps = 25;
  const frameDuration = 1000 / fps;
  const padWidth = 4;
  const staticSrc = "./assets/images/sprites/base.webp";

  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.src = staticSrc;
    return;
  }

  let frames = new Array(frameCount);
  let loaded = 0;
  let rafId = null;
  let playingPromise = null;

  function pad(n) {
    return String(n).padStart(padWidth, "0");
  }

  function preloadAll() {
    return new Promise((resolve) => {
      if (loaded >= frameCount) return resolve();
      const base = String(folder).replace(/\/?$/, "/");
      for (let i = 0; i < frameCount; i++) {
        const n = i + 1;
        const img = new Image();
        img.src = `${base}${prefix}${pad(n)}${ext}`;
        img.onload = onLoad;
        img.onerror = onLoad;
        frames[i] = img;
      }
      function onLoad() {
        loaded++;
        if (loaded >= frameCount) resolve();
      }
    });
  }

  function playOnce() {
    if (playingPromise) return playingPromise;
    playingPromise = new Promise(async (resolve) => {
      try {
        if (loaded < frameCount) await preloadAll();
        let idx = 0;
        let lastTime = 0;
        function step(now) {
          if (!lastTime) lastTime = now;
          const elapsed = now - lastTime;
          if (elapsed >= frameDuration) {
            const current = frames[idx];
            if (current && current.src) el.src = current.src;
            lastTime = now - (elapsed % frameDuration);
            idx += 1;
            if (idx >= frameCount) {
              el.src = staticSrc;
              resolve();
              playingPromise = null;
              return;
            }
          }
          rafId = requestAnimationFrame(step);
        }
        rafId = requestAnimationFrame(step);
      } catch (e) {
        console.error("avatar play error", e);
        el.src = staticSrc;
        resolve();
        playingPromise = null;
      }
    });
    return playingPromise;
  }

  function stop() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    playingPromise = null;
    el.src = staticSrc;
  }
  window.__avatarPlayer = { playOnce, stop, preloadAll };
  preloadAll().catch(() => {});
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
  });
  window.addEventListener("beforeunload", stop);
})();
