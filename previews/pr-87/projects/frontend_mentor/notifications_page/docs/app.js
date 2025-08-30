(function () {
  const list = document.getElementById("notification-list");
  const countEl = document.getElementById("notifications-count");
  const markAllBtn = document.getElementById("mark-all-read");

  if (!list) return;

  function getUnreadItems() {
    return Array.from(list.querySelectorAll(".notification-item.active"));
  }

  function updateCount(animate = true) {
    const unread = getUnreadItems().length;
    if (!countEl) return;
    countEl.textContent = unread;
    if (animate) {
      countEl.classList.add("bump");
      setTimeout(() => countEl.classList.remove("bump"), 220);
    }
  }

  // Ensure unread red-dot indicators reflect unread state for all items
  function refreshIndicators() {
    const items = Array.from(list.querySelectorAll(".notification-item"));
    items.forEach((it) => {
      const hasDot = !!it.querySelector(".unread-indicator");
      const shouldHaveDot = it.classList.contains("active");
      if (shouldHaveDot && !hasDot) {
        const span = document.createElement("span");
        span.className = "unread-indicator";
        span.setAttribute("aria-hidden", "true");
        const title = it.querySelector(".notification-title");
        if (title) title.appendChild(span);
        else it.appendChild(span);
      } else if (!shouldHaveDot && hasDot) {
        const dot = it.querySelector(".unread-indicator");
        if (dot) dot.remove();
      }
    });
  }

  // Toggle read state when clicking a notification
  list.addEventListener("click", (e) => {
    const item = e.target.closest(".notification-item");
    if (!item) return;
    // toggle active class -> unread
    if (item.classList.contains("active")) {
      item.classList.remove("active");
      item.classList.add("read");
    } else {
      item.classList.remove("read");
      item.classList.add("active");
    }
    refreshIndicators();
    updateCount();
  });

  // Mark all as read
  if (markAllBtn) {
    markAllBtn.addEventListener("click", () => {
      const unread = getUnreadItems();
      unread.forEach((it) => {
        it.classList.remove("active");
        it.classList.add("read");
      });
      refreshIndicators();
      updateCount();
    });
  }

  // initialize: ensure read class on items that aren't active
  Array.from(list.querySelectorAll(".notification-item")).forEach((it) => {
    if (!it.classList.contains("active")) it.classList.add("read");
  });

  // initial indicators and count
  refreshIndicators();
  updateCount(false);
})();
