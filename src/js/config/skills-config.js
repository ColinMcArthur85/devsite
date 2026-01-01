export const skillsConfig = {
  HTML: {
    title: "HTML5",
    icon: "html5",
    color: "var(--color-html5)",
    class: "font-html5",
  },
  CSS: {
    title: "CSS3",
    icon: "css3",
    color: "var(--color-css3)",
    class: "font-css3",
  },
  SASS: {
    title: "SASS",
    icon: "sass-alt",
    color: "var(--color-sass-pink)",
    class: "font-sass",
  },
  JavaScript: {
    title: "JavaScript",
    icon: "js",
    color: "var(--color-javascript)",
    class: "font-js",
  },
  PHP: {
    title: "PHP",
    icon: "php",
    color: "var(--color-php)",
    class: "font-php",
    badge: "Coming Soon",
  },
  MySQL: {
    title: "MySQL", // Special handling for color in title if needed
    icon: "mysql",
    color: "var(--color-mysql-blue)", // Gradient start
    colorEnd: "var(--color-mysql-orange)", // Gradient end
    class: "font-mysql",
    badge: "Coming Soon",
    isGradient: true,
  },
  React: {
    // In frameworks section in HTML, but listed in skills.json
    title: "React",
    icon: "react",
    color: "var(--color-react-blue)",
    class: "font-react",
    badge: "Coming Soon",
    isFramework: true, // Maybe separate section?
  },
};
