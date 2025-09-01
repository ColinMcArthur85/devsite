// avatar-breathe.js
// Simple frame player for a breathing avatar sequence.
// - Preloads frames named output_0001.png ... output_0025.png
// - Plays at ~30fps, reverses direction at ends to create inhale/exhale loop
// - Respects prefers-reduced-motion and pauses when page is hidden

(function () {
  const el = document.getElementById("avatar-sprite");
  if (!el) return;

  // Configuration
  // Use relative paths so script works when opened from file:// or served from site root
  const folder = "./assets/images/sprites/avatar_animation/breathe/";
  const prefix = "output_";
  const ext = ".png";
  const frameCount = 187;
  const fps = 25;
  const frameDuration = 1000 / fps;
  const padWidth = 4; // 0001
  const staticSrc = "./assets/images/sprites/colin_gemini.png";
  const inhalePause = 220; // ms pause at full inhale/exhale (tweak)

  // Respect reduced motion
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.src = staticSrc;
    return;
  }

  let frames = new Array(frameCount);
  let loaded = 0;
  let playing = false;
  let rafId = null;
  let lastTime = 0;
  let idx = 0;
  let dir = 1; // 1 forward, -1 backward
  let pausedUntil = 0;

  function pad(n) {
    return String(n).padStart(padWidth, "0");
  }

  function preloadAll() {
    return new Promise((resolve) => {
      for (let i = 0; i < frameCount; i++) {
        const n = i + 1;
        const img = new Image();
        img.src = `${folder}${prefix}${pad(n)}${ext}`;
        img.onload = onLoad;
        img.onerror = onLoad; // treat error as loaded to avoid blocking
        frames[i] = img;
      }
      function onLoad() {
        loaded++;
        if (loaded >= frameCount) resolve();
      }
    });
  }

  function tick(now) {
    if (!lastTime) lastTime = now;
    if (pausedUntil && now < pausedUntil) {
      rafId = requestAnimationFrame(tick);
      return;
    }
    const elapsed = now - lastTime;
    if (elapsed >= frameDuration) {
      const current = frames[idx];
      if (current && current.src) el.src = current.src;
      lastTime = now - (elapsed % frameDuration);

      idx += dir;

      // when hitting ends, reverse and optionally pause
      if (idx >= frameCount) {
        idx = frameCount - 1;
        dir = -1;
        pausedUntil = now + inhalePause;
      } else if (idx < 0) {
        idx = 0;
        dir = 1;
        pausedUntil = now + inhalePause;
      }
    }
    rafId = requestAnimationFrame(tick);
  }

  function start() {
    if (playing) return;
    playing = true;
    lastTime = 0;
    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    playing = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    el.src = staticSrc;
  }

  // Pause when page hidden
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });

  // Preload then start playback
  preloadAll()
    .then(() => {
      // small delay so static image isn't replaced abruptly
      setTimeout(start, 80);
    })
    .catch(() => {
      el.src = staticSrc;
    });

  // cleanup
  window.addEventListener("beforeunload", stop);
})();
