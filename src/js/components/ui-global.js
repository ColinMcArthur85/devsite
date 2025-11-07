// Global shim for ESM UI components
// Keeps window.UIComponents API and auto-init behavior for pages using globals

import { createButton, createBadge, initComponents } from "./ui/index.js";

// Auto-initialize to mirror legacy behavior
document.addEventListener("DOMContentLoaded", initComponents);

// Expose the same global API used by existing scripts
window.UIComponents = { createButton, createBadge };
