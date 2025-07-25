document.addEventListener("DOMContentLoaded", function () {
  // === Cache DOM elements ===
  const contactForm = document.getElementById("contactForm");
  const sections = document.querySelectorAll("section");

  const terminalContainer = document.getElementById("terminal-container");
  const terminalContent = document.querySelector(".terminal-content");
  const commandSpan = document.querySelector(".command-text");

  // === Contact Form Handling ===
  contactForm?.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name")?.value;
    const email = document.getElementById("email")?.value;
    const message = document.getElementById("message")?.value;

    const button = contactForm.querySelector('button[type="submit"]');
    const originalText = button?.textContent;

    if (button) {
      button.textContent = "Message Sent!";
      button.classList.add("bg-green-500");
    }

    contactForm.reset();

    setTimeout(() => {
      if (button && originalText) {
        button.textContent = originalText;
        button.classList.remove("bg-green-500");
      }
    }, 3000);
  });

  // === Animate Sections on Scroll Using IntersectionObserver ===
  const observerOptions = { threshold: 0.1 };
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("opacity-100", "translate-y-0");
        entry.target.classList.remove("opacity-0", "translate-y-4");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    section.classList.add("opacity-0", "translate-y-4");
    observer.observe(section);
  });

  // === Terminal Typing Animation ===
  const startTyping = (element, text, onDone) => {
    let i = 0;
    const type = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i++);
        setTimeout(type, 50);
      } else {
        onDone?.();
      }
    };
    type();
  };

  // This controls the text in the terminal content window
  if (terminalContainer && terminalContent && commandSpan) {
    const commands = [
      { text: "sudo ./init-portfolio.sh", block: false },
      { text: "Loading Developer Profile...", block: true },
      { text: "Welcome to my portfolio!", block: false },
    ];

    let currentCommand = 0;

    const typeNextCommand = () => {
      if (currentCommand < commands.length) {
        const cmd = commands[currentCommand];
        const lineElem = document.createElement("span");
        lineElem.className = "command-text" + (cmd.block ? " block" : "");
        terminalContent.appendChild(lineElem);

        startTyping(lineElem, cmd.text, () => {
          const cursor = document.createElement("span");
          cursor.className = "inline-block w-2 h-5 bg-gray-900 dark:bg-white ml-1 animate-blink align-middle";
          terminalContent.appendChild(cursor);

          if (currentCommand < commands.length - 1) {
            setTimeout(() => {
              cursor.remove();
              currentCommand++;
              typeNextCommand();
            }, 2000);
          }
        });
      }
    };

    setTimeout(typeNextCommand, 1000);
  }
});
