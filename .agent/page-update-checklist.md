# 📋 Page Design Update Checklist

**Created:** 2026-01-02  
**Purpose:** Ensure design consistency across all pages based on the updates made to `index.html`  
**Reference:** `.agent/design-checklist.md` (Phases 1-6 complete)

---

## 🎯 Overview

The following pages need to be updated to match the design system implemented in `src/index.html`:

| Page | File Path | Priority |
|------|-----------|----------|
| About | `src/pages/about.html` | Medium |
| Skills | `src/pages/skills.html` | Medium |
| Projects | `src/pages/projects.html` | High |
| Contact | `src/pages/contact.html` | Medium |

---

## ✅ Master Checklist Per Page

### 1. Hero Section Updates

#### 1.1 Dot Grid Pattern (Costly Signal)
Add the subtle dot grid pattern to hero sections for brand consistency:

```html
<!-- Add inside the hero's background div container, after the radial gradient -->
<div 
  class="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]"
  style="background-image: radial-gradient(circle, currentColor 1px, transparent 1px); background-size: 24px 24px;"
  aria-hidden="true"
></div>
```

**Status by page:**
- [ ] `about.html` - Add to hero section
- [ ] `skills.html` - Add to hero section
- [ ] `projects.html` - Add to hero section
- [ ] `contact.html` - Add to hero section AND contact form section

---

### 2. Tailwind v4 Gradient Syntax Updates

Replace deprecated gradient syntax with v4-compatible syntax:

| Old Syntax | New Syntax |
|------------|------------|
| `bg-gradient-to-br` | `bg-linear-to-br` |
| `bg-gradient-to-r` | `bg-linear-to-r` |
| `bg-gradient-to-b` | `bg-linear-to-b` |
| `bg-gradient-to-t` | `bg-linear-to-t` |
| `bg-gradient-to-l` | `bg-linear-to-l` |
| `bg-gradient-to-tr` | `bg-linear-to-tr` |
| `bg-gradient-to-bl` | `bg-linear-to-bl` |
| `bg-gradient-to-tl` | `bg-linear-to-tl` |

**Status by page:**
- [ ] `about.html`
  - [ ] Search and replace all gradient classes
  - [ ] Verify in dark mode overlay div (line ~29)
  - [ ] Check footer gradient background
- [ ] `skills.html`
  - [ ] Search and replace all gradient classes
  - [ ] Check card backgrounds
- [ ] `projects.html`
  - [ ] Search and replace all gradient classes
  - [ ] Verify dark mode overlay div
  - [ ] Check footer gradient background
- [ ] `contact.html`
  - [ ] Search and replace all gradient classes
  - [ ] Verify dark mode overlay div
  - [ ] Check footer gradient background

---

### 3. Script Tag Updates

Ensure all script tags use ES module syntax for consistency:

**Old format:**
```html
<script src="../assets/js/scripts.js"></script>
```

**New format:**
```html
<script type="module" src="../js/scripts.js"></script>
```

**Also update paths from `../assets/js/` to `../js/` where applicable.**

**Status by page:**
- [ ] `about.html`
  - [ ] Add `type="module"` to all script tags
  - [ ] Verify script paths are correct
  - [ ] Ensure `scroll-reveal.js` is loaded
  - [ ] Ensure `scripts.js` is loaded last
- [ ] `skills.html`
  - [ ] Add `type="module"` to all script tags
  - [ ] Verify script paths are correct
- [ ] `projects.html`
  - [x] Already has `type="module"` ✓
  - [ ] Verify all scripts present
- [ ] `contact.html`
  - [ ] Add `type="module"` to all script tags
  - [ ] Verify script paths are correct

---

### 4. Spacing & Layout Consistency

#### 4.1 Section Padding
Update section padding for more generous whitespace:

| Old | New |
|-----|-----|
| `py-24` | `py-32 lg:py-40` (optional enhancement) |

**Note:** This is optional but recommended for visual consistency with `index.html`.

**Status by page:**
- [ ] `about.html` - Review section padding
- [ ] `skills.html` - Review section padding
- [ ] `projects.html` - Review section padding
- [ ] `contact.html` - Review section padding

#### 4.2 Hero Section Classes
Ensure hero sections use the `hero-section` class for consistent styling:

```html
<section data-animate-on-scroll id="hero" class="hero-section relative overflow-hidden">
```

**Status by page:**
- [x] `about.html` - Has `hero-section` ✓
- [x] `skills.html` - Has `hero-section` ✓
- [x] `projects.html` - Has `hero-section` ✓
- [x] `contact.html` - Has `hero-section` ✓

---

### 5. Background Gradient Orb Sizes

Verify gradient orb sizes use standard Tailwind spacing instead of arbitrary values:

| Arbitrary Value | Standard Class |
|-----------------|----------------|
| `h-[28rem]` | `h-112` |
| `w-[28rem]` | `w-112` |
| `h-[30rem]` | `h-120` (or `h-128`) |
| `w-[30rem]` | `w-120` (or `w-128`) |
| `h-[32rem]` | `h-128` |
| `w-[32rem]` | `w-128` |

**Note:** This is a minor cleanup for Tailwind v4 compatibility.

**Status by page:**
- [ ] `about.html` - Check and update arbitrary height/width values
- [ ] `skills.html` - Check and update arbitrary height/width values
- [ ] `projects.html` - Check and update arbitrary height/width values
- [ ] `contact.html` - Check and update arbitrary height/width values

---

### 6. Body Class Consistency

Ensure body tag has consistent class order:

```html
<body class="dark:bg-dark-background bg-white font-sans text-gray-900 transition-colors duration-300 dark:text-white">
```

**Status by page:**
- [x] `about.html` - Matches ✓
- [x] `skills.html` - Matches ✓
- [x] `projects.html` - Matches ✓
- [x] `contact.html` - Matches ✓

---

### 7. Footer Consistency

Verify footer has gradient background with `bg-linear-to-t` syntax:

```html
<div class="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
```

**Status by page:**
- [ ] `about.html` - Update footer gradient syntax
- [ ] `skills.html` - Update footer gradient syntax (if present)
- [ ] `projects.html` - Update footer gradient syntax
- [ ] `contact.html` - Update footer gradient syntax

---

## 📝 Per-Page Implementation Notes

### `about.html`
- Has complex SVG avatar (same as index.html)
- Has story section with two-column layout
- Has "Core protocols" feature cards
- Has timeline section
- **Script paths use `../assets/js/`** - need to verify if correct or update

### `skills.html`
- Largest page (~1358 lines)
- Contains many inline SVG logos
- Has skill progress bars
- Has detailed skill cards with lists
- **Script section needs review for module type**

### `projects.html`
- Uses dynamic rendering via `projects.js`
- Has filter functionality
- Uses `data-badge` components
- **Already uses `type="module"` on scripts** ✓

### `contact.html`
- Has contact form with validation
- Uses `data-contact-form` attribute
- Has response blueprint section
- Form uses `data-contact-status` for feedback
- **Critical: ensure contact form JS is loaded correctly**

---

## 🔄 Execution Order

1. ⬜ Create backup/new branch
2. ⬜ Update `about.html`
3. ⬜ Update `skills.html`
4. ⬜ Update `projects.html`
5. ⬜ Update `contact.html`
6. ⬜ Run `npm run build` to verify no errors
7. ⬜ Run `npm run test` to verify tests pass
8. ⬜ Visual check in browser (light + dark mode)
9. ⬜ Commit changes
10. ⬜ Create PR

---

## 🧪 Verification Checklist

After all updates, verify:

- [ ] All pages load without console errors
- [ ] Dark mode toggle works on all pages
- [ ] Scroll reveal animations work
- [ ] All navigation links work
- [ ] Forms work (contact page)
- [ ] Filter functionality works (projects page)
- [ ] Build passes: `npm run build`
- [ ] Tests pass: `npm run test`

---

## 📊 Progress Tracker

| Page | Dot Grid | Gradients | Scripts | Spacing | Footer | Complete |
|------|----------|-----------|---------|---------|--------|----------|
| about.html | ✅ | ✅ | ✅ | - | ✅ | ✅ |
| skills.html | ✅ | ✅ | ✅ | - | ✅ | ✅ |
| projects.html | ✅ | ✅ | ✅ | - | ✅ | ✅ |
| contact.html | ✅ | ✅ | ✅ | - | ✅ | ✅ |

---

## Notes

- **Don't break existing functionality** - test after each page update
- **Keep script loading order** - `scripts.js` should always load last
- **Preserve data attributes** - buttons, badges, forms rely on these
- **Check relative paths** - pages are in `src/pages/`, so paths use `../`
