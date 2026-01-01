# Devsite

A modern developer portfolio site built with Vite, Tailwind CSS v4, and Cloudflare Pages.

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📂 Project Structure

- `src/` – Source components, views, state management, and styles.
- `functions/` – Cloudflare Pages Functions (API handlers).
- `__tests__/` – Integration and Security test suites.
- `dist/` – Production build output (generated).
- `public/` – Static assets and configuration.
- `docs/` – Project plans, BDD strategy, and security documentation.

## 🧪 Testing

This project uses a TDD (Test Driven Development) approach with Jest.

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit         # Core unit tests
npm run test:integration  # Full workflow tests
npm run test:security     # Security/XSS/API tests
npm run test:coverage     # Generate coverage report
```

Comprehensive tests cover:
- **Sanitization Utilities**: 47+ tests for XSS prevention.
- **API Security**: 24+ tests for Unsplash API hardening.
- **Core State**: 24+ tests for filter state management.
- **UI Components**: 25+ tests for buttons and badges.
- **View Layer**: 38+ tests for Filter and Results views.

## 🛡️ Security Features

- **XSS Prevention**: Centralized sanitization utilities (`src/js/utils/sanitize.js`).
- **API Hardening**: Input validation, rate limiting, and environment-aware CORS for Unsplash proxy.
- **Security Headers**: CSP, X-Frame-Options, HSTS, and Permissions-Policy configured via `public/_headers`.
- **Automated Audits**: Weekly Dependabot updates and GitHub Actions security workflows.

## 🛠️ Tech Stack

- **Styling**: Tailwind CSS v4
- **Bundler**: Vite
- **Deployment**: Cloudflare Pages
- **Testing**: Jest & JSDOM
- **Code Quality**: Prettier
