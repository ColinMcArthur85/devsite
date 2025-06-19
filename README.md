# Devsite

This repository contains the source code and compiled assets for a small developer portfolio site built with Tailwind CSS.

## Folder structure

- `src/` – Source styles written in Tailwind and custom CSS.
- `public/` – Compiled site with HTML, JavaScript and the final CSS that gets deployed.

Make changes in the `src/` directory and run the build scripts to generate the output under `public/`.

## Building the styles

Use the following npm scripts:

```bash
npm run build  # compile once
npm run watch  # watch files and recompile on changes
```

Both commands output `public/assets/css/style.css` from `src/styles/tailwind.css`.
