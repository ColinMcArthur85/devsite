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

      if (heading.classList.contains('expanded')) {
        list.style.maxHeight = list.scrollHeight + 'px';

        const onOpen = () => {
          list.style.maxHeight = 'none';
          list.removeEventListener('transitionend', onOpen);
        };

        list.addEventListener('transitionend', onOpen);
      } else {
        // Set explicit height so the transition animates when collapsing
        list.style.maxHeight = list.scrollHeight + 'px';
        // Force reflow to apply the height before collapsing
        void list.offsetHeight;
        list.style.maxHeight = '0px';
      }
    });
  });
});
