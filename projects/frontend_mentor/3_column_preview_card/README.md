# Frontend Mentor - 3-column preview card component solution

This is a solution to the [3-column preview card component challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/3column-preview-card-component-pH92eAR2-). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

### The challenge

Users should be able to:

- View the optimal layout depending on their device's screen size
- See hover states for interactive elements

### Screenshot

![](public/images/3%20Column%20preview%20Card%20Image.png)

### Links

- Solution URL: [Github Page](https://github.com/ColinMcArthur85/3-column-preview-card-component)
- Live Site URL: [Add live site URL here](https://your-live-site-url.com)

## My process

### Built with

- Semantic HTML5 markup
- SASS (Variables, Nesting)
- Flexbox
- CSS Grid

**Note: These are just examples. Delete this note and replace the list above with your own choices**

### What I learned

Reinforing lots of what I know but was also able to try some 'fancy' things like trailing & selectors which you can see in the code below.

```scss
&__btn:hover,
&__btn:focus {
  outline: 2px solid $clr-neutral-400;

  .orange & {
    background-color: $clr-primary-orange-400;
    color: $clr-neutral-400;
  }
  .cyan & {
    background-color: $clr-primary-cyan-400;
    color: $clr-neutral-400;
  }
  .dark-cyan & {
    background-color: $clr-primary-cyan-900;
    color: $clr-neutral-400;
```

### Continued development

Im feeling pretty good and am ready to move onto learning about extends, mixins and interpolation now.

## Author

- Frontend Mentor - [@yourusername](https://www.frontendmentor.io/profile/ColinMcArthur85)
