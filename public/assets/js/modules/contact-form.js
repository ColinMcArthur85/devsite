(function (global) {
  const SELECTORS = {
    form: "[data-contact-form]",
    submit: "[data-contact-submit]",
    status: "[data-contact-status]",
  };

  const CLASSNAMES = {
    busy: "is-busy",
    success: "is-success",
    error: "is-error",
  };

  const LABELS = {
    busy: "Sending…",
    success: "Message sent!",
    error: "Something went wrong",
  };

  function pickLabel(button, fallback) {
    if (!button) return fallback;
    const { busyLabel, successLabel, errorLabel } = button.dataset;
    switch (fallback) {
      case LABELS.busy:
        return busyLabel || fallback;
      case LABELS.success:
        return successLabel || fallback;
      case LABELS.error:
        return errorLabel || fallback;
      default:
        return fallback;
    }
  }

  function ContactFormView(form) {
    const submitButton = form.querySelector(SELECTORS.submit);
    const statusEl = form.querySelector(SELECTORS.status);
    const originalLabel = submitButton ? submitButton.textContent.trim() : "";

    const updateStatus = (message, stateClass) => {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.classList.remove(CLASSNAMES.success, CLASSNAMES.error);
      if (stateClass) {
        statusEl.classList.add(stateClass);
      }
    };

    return {
      getSubmitButton() {
        return submitButton;
      },
      reset() {
        form.reset();
        if (statusEl) {
          statusEl.textContent = "";
          statusEl.classList.remove(CLASSNAMES.success, CLASSNAMES.error);
        }
        if (submitButton) {
          submitButton.textContent = originalLabel;
          submitButton.classList.remove(CLASSNAMES.busy, CLASSNAMES.success, CLASSNAMES.error);
          submitButton.disabled = false;
        }
      },
      setBusy() {
        if (!submitButton) return;
        submitButton.disabled = true;
        submitButton.classList.remove(CLASSNAMES.success, CLASSNAMES.error);
        submitButton.classList.add(CLASSNAMES.busy);
        submitButton.textContent = pickLabel(submitButton, LABELS.busy);
        updateStatus("", null);
      },
      showSuccess(message) {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.classList.remove(CLASSNAMES.busy, CLASSNAMES.error);
          submitButton.classList.add(CLASSNAMES.success);
          submitButton.textContent = pickLabel(submitButton, LABELS.success);
        }
        updateStatus(message, CLASSNAMES.success);
      },
      showError(message) {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.classList.remove(CLASSNAMES.busy, CLASSNAMES.success);
          submitButton.classList.add(CLASSNAMES.error);
          submitButton.textContent = pickLabel(submitButton, LABELS.error);
        }
        updateStatus(message, CLASSNAMES.error);
      },
    };
  }

  const ContactFormService = {
    send(formData) {
      // In a static build we fake sending the message but return a promise-like API
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ ok: true, data: formData });
        }, 800);
      });
    },
  };

  function initContactForm() {
    const form = document.querySelector(SELECTORS.form);
    if (!form) return;

    const view = ContactFormView(form);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const submitButton = view.getSubmitButton();
      if (!submitButton) return;

      const formData = Object.fromEntries(new FormData(form).entries());
      view.setBusy();

      ContactFormService.send(formData)
        .then(() => {
          view.showSuccess("Thanks for reaching out! I'll respond within one business day.");
          form.reset();
          setTimeout(() => {
            view.reset();
          }, 3200);
        })
        .catch(() => {
          view.showError("We couldn't send your message. Please try again shortly.");
        });
    });
  }

  global.SiteFeatureModules = global.SiteFeatureModules || [];
  global.SiteFeatureModules.push({ name: "contactForm", init: initContactForm });
})(window);
