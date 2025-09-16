document.addEventListener("DOMContentLoaded", () => {
  const basePath = window.location.pathname.includes("/pages/") ? "../" : "./";

  fetch(`${basePath}data/skills.json`)
    .then((res) => res.json())
    .then((data) => {
      const total = Object.values(data).reduce((sum, val) => sum + val, 0);

      const summary = document.getElementById("skill-summary");
      if (summary) {
        summary.innerHTML = "";
      }

      Object.entries(data).forEach(([lang, count]) => {
        const percent = ((count / total) * 100).toFixed(1);
        const card = document.querySelector(`[data-skill="${lang}"]`);
        if (card) {
          const bar = card.querySelector(".progress-bar-fill");
          const label = card.querySelector(".progress-percent");
          const lines = card.querySelector(".lines-count");
          if (bar) {
            bar.style.width = `${percent}%`;
          }
          if (lines) {
            lines.textContent = `${count} lines`;
          }
          if (label) {
            label.textContent = `${percent}%`;
          }
        }

        if (summary) {
          const row = document.createElement("div");
          row.className =
            "flex items-center justify-between rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-600 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300";
          const safePercent = total === 0 ? "0%" : `${percent}%`;
          row.innerHTML = `<span>${lang}</span><span>${safePercent}</span>`;
          summary.appendChild(row);
        }
      });
    })
    .catch(console.error);
});
