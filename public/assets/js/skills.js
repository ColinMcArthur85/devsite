document.addEventListener("DOMContentLoaded", () => {
  const basePath = window.location.pathname.includes("/pages/") ? "../" : "./";

  fetch(`${basePath}data/skills.json`)
    .then((res) => res.json())
    .then((data) => {
      const total = Object.values(data).reduce((sum, val) => sum + val, 0);

      const summary = document.getElementById("skill-summary");
      const createdPills = [];

      if (summary) {
        summary.innerHTML = "";
      }

      Object.entries(data).forEach(([lang, count]) => {
        const percentValue = total === 0 ? 0 : (count / total) * 100;
        const percent = Number.isFinite(percentValue) ? percentValue.toFixed(1) : "0.0";
        const displayPercent = total === 0 ? "0%" : `${percent}%`;
        const card = document.querySelector(`[data-skill="${lang}"]`);
        if (card) {
          const bar = card.querySelector(".progress-bar-fill");
          const label = card.querySelector(".progress-percent");
          const lines = card.querySelector(".lines-count");
          if (bar) {
            bar.style.width = `${displayPercent}`;
          }
          if (lines) {
            lines.textContent = `${count.toLocaleString()} lines`;
          }
          if (label) {
            label.textContent = displayPercent;
          }
        }

        if (summary) {
          const pill = document.createElement("div");
          pill.className = "usage-pill";
          pill.dataset.percent = percentValue.toFixed(1);
          pill.innerHTML = `<span>${lang}</span><span>${displayPercent}</span>`;
          summary.appendChild(pill);
          createdPills.push(pill);
        }
      });

      if (!createdPills.length) {
        return;
      }

      const prefersReducedMotion = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
        createdPills.forEach((pill) => {
          const percent = pill.dataset.percent ? `${pill.dataset.percent}%` : "0%";
          pill.style.setProperty("--fill-width", percent);
          pill.classList.add("is-visible");
        });
        return;
      }

      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const pill = entry.target;
              const percent = pill.dataset.percent ? `${pill.dataset.percent}%` : "0%";
              pill.style.setProperty("--fill-width", percent);
              pill.classList.add("is-visible");
              obs.unobserve(pill);
            }
          });
        },
        { threshold: 0.35 },
      );

      createdPills.forEach((pill) => observer.observe(pill));
    })
    .catch(console.error);
});
