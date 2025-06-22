document.querySelectorAll(".boop").forEach((svg) => {
  svg.addEventListener("mouseenter", () => {
    svg.style.transform = "rotate(30deg)";
    setTimeout(() => {
      svg.style.transform = "rotate(-15deg)";
      setTimeout(() => {
        svg.style.transform = "rotate(5deg)";
        setTimeout(() => {
          svg.style.transform = "rotate(0deg)";
        }, 150);
      }, 150);
    }, 150);
  });
});
