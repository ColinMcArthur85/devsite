const basePath = "./assets/images/sprites/colin_avatar";
const parts = ["brows", "eyes", "mouth", "glasses"];

const expressions = {
  raise_brows: { brows: "-70%", eyes: "0%", mouth: "0%", glasses: "0%" },
  blink: { brows: "0%", eyes: "-35%", mouth: "0%", glasses: "0%" },
  open_forward: { brows: "0%", eyes: "0%", mouth: "0%", glasses: "0%" },
  open_left: { brows: "0%", eyes: "0%", mouth: "0%", glasses: "0%" },
  open_right: { brows: "0%", eyes: "0%", mouth: "0%", glasses: "0%" },
  narrow_forward: { brows: "0%", eyes: "0%", mouth: "0%", glasses: "0%" },
  narrow_left: { brows: "0%", eyes: "0%", mouth: "0%", glasses: "0%" },
  narrow_right: { brows: "0%", eyes: "0%", mouth: "0%", glasses: "0%" },
};

// Preload images once
const images = {
  brows: {
    neutral: `${basePath}/Brows/brows_neutral.png`,
  },
  eyes: {
    open_forward: `${basePath}/Eyes/open_forward.png`,
    blink: `${basePath}/Eyes/blink.png`,
    open_left: `${basePath}/Eyes/open_left.png`,
    open_right: `${basePath}/Eyes/open_right.png`,
    narrow_forward: `${basePath}/Eyes/narrow_forward.png`,
    narrow_left: `${basePath}/Eyes/narrow_left.png`,
    narrow_right: `${basePath}/Eyes/narrow_right.png`,
  },
  mouth: {
    smile: `${basePath}/Mouth/smile.png`,
  },
  glasses: {
    default: `${basePath}/Glasses/glasses.png`,
  },
};

function applyExpression(name) {
  const expression = expressions[name];
  if (!expression) return;

  // Update images
  parts.forEach((part) => {
    const el = document.getElementById(part);
    if (!el) return;

    if (part === "eyes") {
      el.src = images.eyes[name] || images.eyes.open_forward;
    } else if (part === "brows") {
      el.src = images.brows.neutral;
    } else if (part === "mouth") {
      el.src = images.mouth.smile;
    } else if (part === "glasses") {
      el.src = images.glasses.default;
    }

    el.style.transform = `translate(0%, ${expression[part]})`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const idleExpressions = Object.keys(expressions);
  let lastExpression = null;

  function getRandomExpression() {
    let next;
    do {
      next = idleExpressions[Math.floor(Math.random() * idleExpressions.length)];
    } while (next === lastExpression);
    lastExpression = next;
    return next;
  }

  function cycleExpressions() {
    applyExpression(getRandomExpression());
    const delay = Math.floor(Math.random() * 1000) + 1000;
    setTimeout(cycleExpressions, delay);
  }

  applyExpression("open_forward");
  cycleExpressions();
});
