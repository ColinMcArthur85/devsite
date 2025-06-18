(function () {
  function createButton({ text = '', href = '', classes = '', type = 'button', onClick = null, html = '' }) {
    const element = href ? document.createElement('a') : document.createElement('button');
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
    if (typeof onClick === 'function') {
      element.addEventListener('click', onClick);
    }
    return element;
  }

  function createBadge({ text = '', classes = '' }) {
    const span = document.createElement('span');
    span.textContent = text;
    span.className = classes ? `badge ${classes}` : 'badge';
    return span;
  }

  function initComponents() {
    document.querySelectorAll('[data-button]').forEach((el) => {
      const options = {
        text: el.dataset.text,
        href: el.dataset.href,
        classes: el.dataset.classes || 'btn',
        type: el.dataset.type || 'button',
        html: el.innerHTML.trim(),
      };
      const btn = createButton(options);
      el.replaceWith(btn);
    });

    document.querySelectorAll('[data-badge]').forEach((el) => {
      const options = {
        text: el.dataset.badge || el.dataset.text || el.textContent,
        classes: el.dataset.classes || '',
      };
      const badge = createBadge(options);
      el.replaceWith(badge);
    });
  }

  document.addEventListener('DOMContentLoaded', initComponents);

  window.UIComponents = { createButton, createBadge };
})();
