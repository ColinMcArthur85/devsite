// Gentle orbiting animation for .orb SVG circles around the face clip center.
// Respects prefers-reduced-motion.
(() => {
  if (typeof window === "undefined") return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const svg = document.querySelector("#avatar-sprite svg");
  if (!svg) return;

  // faceClip circle provides the intended center/orbit origin
  const clipCircle = svg.querySelector("#faceClip circle");
  const centerX = parseFloat(clipCircle?.getAttribute("cx") ?? 160);
  const centerY = parseFloat(clipCircle?.getAttribute("cy") ?? 188);

  const SPEED_MULT = 0.2; // global angular speed multiplier
  const PULSE_SPEED_MULT = 0.2; // pulse frequency multiplier
  const RADIAL_MULT = 0.2; // pulse amplitude multiplier

  const orbEls = Array.from(svg.querySelectorAll("circle.orb"));
  if (!orbEls.length) return;

  const orbs = orbEls.map((el) => {
    const cx = parseFloat(el.getAttribute("cx") || 0);
    const cy = parseFloat(el.getAttribute("cy") || 0);
    const dx = cx - centerX;
    const dy = cy - centerY;
    return {
      el,
      baseR: Math.sqrt(dx * dx + dy * dy),
      angle: Math.atan2(dy, dx),
      speed: (Math.random() * 0.6 + 0.2) * (Math.random() < 0.5 ? 1 : -1) * SPEED_MULT, // rad/s
      radialPulse: (Math.random() * 6 + 2) * RADIAL_MULT, // px
      pulseSpeed: (Math.random() * 0.9 + 0.4) * PULSE_SPEED_MULT,
    };
  });

  let last = performance.now();
  function tick(now) {
    const dt = (now - last) / 1000;
    last = now;

    for (const o of orbs) {
      o.angle += o.speed * dt;
      const pulse = Math.sin((now / 1000) * o.pulseSpeed * Math.PI * 2) * o.radialPulse;
      const r = o.baseR + pulse;
      const x = centerX + Math.cos(o.angle) * r;
      const y = centerY + Math.sin(o.angle) * r * 0.95; // slight ellipse for natural feel
      o.el.setAttribute("cx", x.toFixed(2));
      o.el.setAttribute("cy", y.toFixed(2));
      // subtle scale pulse
      const scale = 1 + 0.06 * Math.sin((now / 1000) * o.pulseSpeed * Math.PI * 2 + o.angle);
      o.el.style.transform = `scale(${scale})`;
      o.el.style.transformBox = "fill-box";
      o.el.style.transformOrigin = "center";
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
