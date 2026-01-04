document.addEventListener("DOMContentLoaded", () => {
  const basePath = window.location.pathname.includes("/pages/") ? "../" : "./";

  const externalStats = {
    HTML: 200,
    CSS: 500,
    JavaScript: 10000,
    TypeScript: 5000,
    MySQL: 500,
    React: 5000,
  };

  fetch(`${basePath}data/skills.json`)
    .then((res) => res.json())
    .then((rawSkills) => {
      // Merge with external stats
      const data = { ...rawSkills };
      Object.keys(externalStats).forEach((key) => {
        data[key] = (data[key] || 0) + externalStats[key];
      });

      const total = Object.values(data).reduce((sum, val) => sum + val, 0);

      // Update Total Lines in the hero section UI if it exists
      const totalDisplay = document.querySelector(".total-lines-count");
      if (totalDisplay) {
        totalDisplay.textContent = total.toLocaleString();
      }

      const summary = document.getElementById("skill-summary");
      const createdPills = [];

      if (summary) {
        summary.innerHTML = "";
      }

      Object.entries(data).forEach(([lang, count]) => {
        // Match the homepage calculation: round(count / 25000 * 100) capped at 100
        const percentValue = count > 0 ? Math.min(100, Math.round((count / 25000) * 100)) : 0;
        const displayPercent = `${percentValue}%`;

        const card = document.querySelector(`[data-skill="${lang}"]`);
        if (card) {
          const bar = card.querySelector(".progress-bar-fill");
          const label = card.querySelector(".progress-percent");
          const lines = card.querySelector(".lines-count");
          if (bar) {
            bar.style.width = displayPercent;
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
          pill.setAttribute("tabindex", "0");
          
          // Check if this is a "coming soon" language (0 lines)
          const isComingSoon = lang === "PHP" && count === 0;
          
          // Use relative percentage for the summary pillar chart
          const relativePercent = total === 0 ? 0 : (count / total) * 100;
          pill.dataset.percent = relativePercent.toFixed(1);
          
          if (isComingSoon) {
            pill.innerHTML = `<span>${lang}</span><span class="text-slate-400 italic">Soon</span>`;
            pill.classList.add("opacity-60");
          } else {
            pill.innerHTML = `<span>${lang}</span><span>${displayPercent}</span>`;
          }
          
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
