# Dependency Cleanup TODO

This document outlines dependencies that should be reviewed for removal or consolidation.

---

## 📦 Current Dependencies

```json
{
  "devDependencies": {
    "@babel/core": "^7.26.0",
    "@babel/preset-env": "^7.26.0",
    "@tailwindcss/vite": "^4.1.17",
    "autoprefixer": "^10.4.21",
    "babel-jest": "^29.7.0",
    "concurrently": "^9.2.0",
    "dotenv": "^16.4.5",
    "jest": "^29.7.0",
    "nodemon": "^3.1.10",
    "prettier": "^3.5.3",
    "prettier-plugin-tailwindcss": "^0.6.11",
    "tailgrids": "^2.3.0",
    "tailwindcss": "^4.1.5",
    "vite": "^6.4.1"
  },
  "dependencies": {
    "@tailwindcss/cli": "^4.1.4"
  }
}
```

---

## ❌ Recommended for Removal

### 1. `autoprefixer` - **Likely Unused**
- [ ] **Remove**: Tailwind CSS v4 includes autoprefixing by default
- **Reason**: With `@tailwindcss/vite` plugin, autoprefixer is built-in
- **Action**: Remove from `devDependencies`
- **Verification**: Build and check CSS output still has vendor prefixes

### 2. `nodemon` - **Unused**
- [ ] **Remove**: Not referenced in any npm scripts or config files
- **Reason**: Vite handles hot-reload; Wrangler handles function reloading
- **Action**: Remove from `devDependencies`
- **Verification**: Confirm no scripts use `nodemon`

### 3. `concurrently` - **Unused**
- [ ] **Remove**: Not referenced in any npm scripts
- **Reason**: Previous build setup may have needed this, but current `wrangler pages dev -- vite` handles concurrent processes
- **Action**: Remove from `devDependencies`
- **Verification**: Check `package.json` scripts don't use `concurrently`

### 4. `dotenv` - **Potentially Unused**
- [ ] **Review**: Check if used anywhere in codebase
- **Reason**: Cloudflare uses `.dev.vars` and `wrangler.toml` for env vars, not `dotenv`
- **Action**: Search codebase for `require('dotenv')` or `import dotenv`
- **Verification**: If not found, safe to remove

### 5. `@tailwindcss/cli` (regular dependency) - **Misplaced**
- [ ] **Move to devDependencies**: CLI tool is only needed for development
- **Reason**: Should be devDependency, not production dependency
- **Action**: Move from `dependencies` to `devDependencies`
- **Verification**: Build still works

### 6. `tailgrids` - **Review Usage**
- [ ] **Review**: Check if Tailgrids components are actually used
- **Reason**: Only referenced in `tailwind.config.js` as a plugin
- **Action**: Search for Tailgrids-specific classes or components in HTML/CSS
- **Verification**: If not actively used, consider removing to reduce bundle size

---

## ⚠️ Dependencies to Keep (But Consider Updating)

### Babel Stack (`@babel/core`, `@babel/preset-env`, `babel-jest`)
- **Keep**: Required for Jest testing
- **Consider**: Could potentially switch to Vitest which would eliminate need for Babel
- [ ] **Future TODO**: Evaluate migrating from Jest to Vitest for better Vite integration

### Prettier Stack (`prettier`, `prettier-plugin-tailwindcss`)
- **Keep**: Used for code formatting
- **Note**: Consider adding a `.prettierrc` format script to `package.json`
- [ ] **Improvement**: Add `"format": "prettier --write ."` script

---

## 🔧 Cleanup Commands

After reviewing and confirming each removal:

```bash
# Step 1: Remove unused dependencies
npm uninstall autoprefixer nodemon concurrently dotenv

# Step 2: Move @tailwindcss/cli to devDependencies
npm uninstall @tailwindcss/cli
npm install -D @tailwindcss/cli

# Step 3: Verify build still works
npm run build

# Step 4: Verify dev server works
npm run dev

# Step 5: Verify tests pass
npm test
```

---

## 📋 Post-Cleanup Verification Checklist

- [ ] `npm run build` completes without errors
- [ ] `npm run dev` starts correctly
- [ ] Site renders properly in browser
- [ ] Tailwind styles are applied correctly
- [ ] Dark mode toggle works
- [ ] `npm test` passes all tests
- [ ] CSS includes vendor prefixes (check built CSS)

---

## 🎯 Expected Results

After cleanup, `package.json` should look like:

```json
{
  "devDependencies": {
    "@babel/core": "^7.26.0",
    "@babel/preset-env": "^7.26.0",
    "@tailwindcss/cli": "^4.1.4",
    "@tailwindcss/vite": "^4.1.17",
    "babel-jest": "^29.7.0",
    "jest": "^29.7.0",
    "prettier": "^3.5.3",
    "prettier-plugin-tailwindcss": "^0.6.11",
    "tailwindcss": "^4.1.5",
    "vite": "^6.4.1"
  },
  "dependencies": {}
}
```

**Estimated reduction**: ~4-6 packages removed, cleaner dependency tree.
