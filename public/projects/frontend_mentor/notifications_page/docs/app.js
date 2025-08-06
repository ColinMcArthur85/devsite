document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.querySelector(".notifications-panel-mark-read");
  const notificationsCount = document.querySelector(".notifications-panel-count");

  let isResetMode = false;

  toggleButton.addEventListener("click", function () {
    if (isResetMode) {
      resetNotifications();
    } else {
      markAllAsRead();
    }

    isResetMode = !isResetMode;
    toggleButton.textContent = isResetMode ? "Reset" : "Mark all as read";
  });

  function markAllAsRead() {
    const notificationItems = document.querySelectorAll(".notification-item.active");

    notificationItems.forEach(function (item) {
      item.classList.remove("active");
      const unreadIndicator = item.querySelector(".unread-indicator");
      if (unreadIndicator) {
        unreadIndicator.remove();
      }
    });

    // Set the notifications count to 0
    notificationsCount.textContent = "0";
  }

  function resetNotifications() {
    const notificationItems = document.querySelectorAll(".notification-item:not(.active)");
    const topThreeItems = Array.from(notificationItems).slice(0, 3);

    topThreeItems.forEach(function (item, index) {
      item.classList.add("active");

      const title = item.querySelector(".notification-title");
      const unreadIndicator = document.createElement("span");
      unreadIndicator.classList.add("unread-indicator");
      title.appendChild(unreadIndicator);
    });

    // Set the notifications count back to the original value
    notificationsCount.textContent = "3";
  }
});
