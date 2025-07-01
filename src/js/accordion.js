// Simple accordion for skill sections

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.skill-heading').forEach((heading) => {
    const list = heading.nextElementSibling;
    if (!list || !list.classList.contains('skill-list')) return;

    list.style.display = 'none';

    heading.addEventListener('click', () => {
      heading.classList.toggle('expanded');
      if (list.style.display === 'none') {
        list.style.display = 'block';
      } else {
        list.style.display = 'none';
      }
    });
  });
});
