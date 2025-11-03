(function (global) {
  const SELECTORS = {
    container: "[data-terminal]",
    content: "[data-terminal-content]",
    config: "[data-terminal-config]",
  };

  const DEFAULTS = {
    commands: [
      { text: "sudo ./init-portfolio.sh" },
      { text: "Loading Developer Profile...", pause: 1500 },
      { text: "Welcome to my portfolio!" },
    ],
    startDelay: 800,
    typingDelay: 45,
    holdDelay: 2000,
  };

  function parseConfig(container) {
    const configScript = container.querySelector(SELECTORS.config);
    if (!configScript) return DEFAULTS;

    try {
      const parsed = JSON.parse(configScript.textContent.trim());
      return {
        ...DEFAULTS,
        ...parsed,
        commands: parsed.commands || DEFAULTS.commands,
      };
    } catch (error) {
      console.warn("Failed to parse terminal configuration", error);
      return DEFAULTS;
    }
  }

  function createLineElement() {
    const line = document.createElement("span");
    line.className = "terminal__line";
    return line;
  }

  function createCursor() {
    const cursor = document.createElement("span");
    cursor.className = "terminal__cursor";
    cursor.setAttribute("aria-hidden", "true");
    return cursor;
  }

  function typeText(node, text, delay) {
    return new Promise((resolve) => {
      let index = 0;
      function tick() {
        if (index < text.length) {
          node.textContent += text.charAt(index++);
          setTimeout(tick, delay);
        } else {
          resolve();
        }
      }
      tick();
    });
  }

  async function runSequence(contentNode, config) {
    for (let i = 0; i < config.commands.length; i += 1) {
      const line = createLineElement();
      contentNode.appendChild(line);
      await typeText(line, config.commands[i].text, config.typingDelay);

      const cursor = createCursor();
      contentNode.appendChild(cursor);

      const hold = config.commands[i].pause ?? config.holdDelay;
      await new Promise((resolve) => setTimeout(resolve, hold));
      cursor.remove();
    }
  }

  function initTerminalTyping() {
    const container = document.querySelector(SELECTORS.container);
    if (!container) return;

    const content = container.querySelector(SELECTORS.content);
    if (!content) return;

    const config = parseConfig(container);

    setTimeout(() => {
      runSequence(content, config);
    }, config.startDelay);
  }

  global.SiteFeatureModules = global.SiteFeatureModules || [];
  global.SiteFeatureModules.push({ name: "terminal", init: initTerminalTyping });
})(window);
