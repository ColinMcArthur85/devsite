// Simple accordion for skill sections

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.skill-heading').forEach((heading) => {
    const list = heading.nextElementSibling;
    if (!list || !list.classList.contains('skill-list')) return;

    list.style.overflow = 'hidden';
    list.style.maxHeight = '0px';
    list.style.transition = 'max-height 0.3s ease';

    heading.addEventListener('click', () => {
      heading.classList.toggle('expanded');
      if (list.style.maxHeight === '0px' || list.style.maxHeight === '') {
        list.style.maxHeight = list.scrollHeight + 'px';
      } else {
        list.style.maxHeight = '0px';
      }
    });
  });
});
