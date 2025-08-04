# Tailwind Component Library

Copy the following into your `assets/css/style.css` under the `@layer components` block:

```css
@layer components {
  /* Card */
  .card {
    @apply dark:bg-dark-background transform rounded-lg bg-white p-8 shadow-lg transition-all duration-300;
  }
  .card:hover {
    @apply -translate-y-1 shadow-xl;
  }

  /* Button base */
  .btn {
    @apply transform rounded-lg px-8 py-3 transition-all duration-300;
  }

  /* Primary Button */
  .btn-primary {
    @apply btn bg-primary text-white shadow-lg;
  }
  .btn-primary:hover {
    @apply shadow-blue-300/30 dark:shadow-blue-500/20 -translate-y-1 bg-blue-600;
  }

  /* Secondary Button */
  .btn-secondary {
    @apply btn dark:bg-dark-background-secondary border border-gray-200 bg-white text-gray-900 transition-colors dark:border-gray-700 dark:text-white;
  }
  .btn-secondary:hover {
    @apply border-gray-900 dark:border-white;
  }

  /* Section wrappers */
  .section {
    @apply translate-y-4 py-24 transition-all duration-500;
  }
  .section-alt {
    @apply dark:bg-dark-background-secondary bg-gray-50;
  }
  .section-container {
    @apply container mx-auto px-4;
  }

  /* Typography */
  .section-title {
    @apply mb-4 text-center text-4xl font-bold;
  }
  .section-text {
    @apply mb-16 text-center text-xl text-gray-600 dark:text-gray-400;
  }

  /* Badge / Pill */
  .badge {
    @apply dark:bg-dark-background-secondary rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 dark:text-gray-400;
  }
}
```
