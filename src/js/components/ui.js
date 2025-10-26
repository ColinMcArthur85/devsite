(function () {
  function createButton({ text = "", href = "", classes = "", type = "button", onClick = null, html = "" }) {
    const element = href ? document.createElement("a") : document.createElement("button");
    if (href) {
      element.href = href;
    } else {
      element.type = type;
    }
    if (text) {
      element.textContent = text;
    } else if (html) {
      element.innerHTML = html;
    }
    element.className = classes;
    if (typeof onClick === "function") {
      element.addEventListener("click", onClick);
    }
    return element;
  }

  function createBadge({ text = "", classes = "", color = "white", bare = false }) {
    // Define a mapping of text to Tailwind color classes or CSS variables
    const colorMap = {
      HTML5: "var(--color-html5)",
      CSS3: "var(--color-css3)",
      SASS: "var(--color-sass-pink)",
      JavaScript: "var(--color-javascript)",
      PHP: "var(--color-php)",
      MySQL: "var(--color-mysql-blue)",
      Git: "bg-purple-500",
      API: "var(--color-secondary)",
      Backend: "bg-gray-700",
      Security: "bg-red-500",
      Tailwind: "var(--color-tailwind-blue)",
      Frontend: "bg-green-500",
      "CSS Battle": "var(--color-css-battle)",
      "Frontend Mentor": "var(--color-frontend-mentor)",
      Completed: "var(--color-green-600)",
      Documented: "bg-blue-500",
      "Dev Tools": "bg-gray-500",
      "Component Design": "bg-purple-500",
      "Coming Soon": "bg-yellow-500 text-white",
    };

    // Create the badge element
    const span = document.createElement("span");
    span.textContent = text;
    // In bare mode, do not force a text color; the caller will style
    if (!bare) {
      span.style.color = color;
    }

    // Handle background color
    if (bare) {
      // In bare mode, don't apply any background. Expose intended color via data-* for activations.
      const mapped = colorMap[text];
      if (mapped) {
        if (mapped.startsWith("var(")) {
          span.dataset.colorVar = mapped; // e.g., var(--color-html5)
        } else {
          // Tailwind background class string
          span.dataset.twBg = mapped;
        }
      }
      span.className = classes ? `badge ${classes}` : "badge";
    } else {
      if (colorMap[text]) {
        if (colorMap[text].startsWith("var(")) {
          // If the color is a CSS variable, apply it directly
          span.style.backgroundColor = colorMap[text];
          span.className = "badge";
        } else {
          // Otherwise, use Tailwind classes
          const backgroundColorClass = colorMap[text];
          span.className = classes ? `badge ${classes} ${backgroundColorClass}` : `badge ${backgroundColorClass}`;
        }
      } else {
        // Default to primary color if no match
        span.className = classes ? `badge ${classes} bg-primary` : `badge bg-primary`;
      }
    }

    return span;
  }

  function initComponents() {
    document.querySelectorAll("[data-button]").forEach((el) => {
      const options = {
        text: el.dataset.text,
        href: el.dataset.href,
        classes: el.dataset.classes || "btn",
        type: el.dataset.type || "button",
        html: el.innerHTML.trim(),
      };
      const btn = createButton(options);
      el.replaceWith(btn);
    });

    document.querySelectorAll("[data-badge]").forEach((el) => {
      const options = {
        text: el.dataset.badge || el.dataset.text || el.textContent,
        classes: el.dataset.classes || "",
      };
      const badge = createBadge(options);
      el.replaceWith(badge);
    });
  }

  document.addEventListener("DOMContentLoaded", initComponents);

  window.UIComponents = { createButton, createBadge };
})();
