document.addEventListener("DOMContentLoaded", () => {
  fetch("/data/skills.json")
    .then((res) => res.json())
    .then((data) => {
      console.log("Loaded skills data:", data);
      const total = Object.values(data).reduce((sum, val) => sum + val, 0);

      Object.entries(data).forEach(([lang, count]) => {
        const percent = ((count / total) * 100).toFixed(1);
        const card = document.querySelector(`[data-skill="${lang}"]`);
        if (card) {
          const bar = card.querySelector(".progress-bar-fill");
          const label = card.querySelector(".progress-percent");
          if (bar) {
            bar.style.width = `${percent}%`;
          }
          if (label) {
            label.textContent = `${percent}%`;
          }
        }
      });
    })
    .catch(console.error);
});
