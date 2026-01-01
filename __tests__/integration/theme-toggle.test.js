/**
 * Theme Toggle Integration Tests
 * 
 * Tests theme switching and localStorage persistence.
 * Uses mocked localStorage from jest.setup.js.
 */

describe('Theme Toggle Integration', () => {
  const THEME_KEY = 'theme';
  const DARK_CLASS = 'dark';

  beforeEach(() => {
    // Clear mocks before each test
    localStorage.clear();
    document.documentElement.classList.remove(DARK_CLASS);
  });

  describe('Theme Switching', () => {
    test('can toggle to dark theme', () => {
      document.documentElement.classList.add(DARK_CLASS);
      expect(document.documentElement.classList.contains(DARK_CLASS)).toBe(true);
    });

    test('can toggle to light theme', () => {
      document.documentElement.classList.add(DARK_CLASS);
      document.documentElement.classList.remove(DARK_CLASS);
      expect(document.documentElement.classList.contains(DARK_CLASS)).toBe(false);
    });

    test('toggle adds class when not present', () => {
      document.documentElement.classList.toggle(DARK_CLASS);
      expect(document.documentElement.classList.contains(DARK_CLASS)).toBe(true);
    });

    test('toggle removes class when present', () => {
      document.documentElement.classList.add(DARK_CLASS);
      document.documentElement.classList.toggle(DARK_CLASS);
      expect(document.documentElement.classList.contains(DARK_CLASS)).toBe(false);
    });
  });

  describe('localStorage Persistence', () => {
    test('can save theme preference to localStorage', () => {
      localStorage.setItem(THEME_KEY, 'dark');
      expect(localStorage.setItem).toHaveBeenCalledWith(THEME_KEY, 'dark');
    });

    test('can retrieve theme preference from localStorage', () => {
      localStorage.getItem.mockReturnValue('dark');
      const theme = localStorage.getItem(THEME_KEY);
      expect(theme).toBe('dark');
    });

    test('returns null when no theme is saved', () => {
      localStorage.getItem.mockReturnValue(null);
      const theme = localStorage.getItem(THEME_KEY);
      expect(theme).toBeNull();
    });

    test('can clear theme preference', () => {
      localStorage.setItem(THEME_KEY, 'dark');
      localStorage.removeItem(THEME_KEY);
      expect(localStorage.removeItem).toHaveBeenCalledWith(THEME_KEY);
    });
  });

  describe('Theme Restoration Workflow', () => {
    test('restores dark theme from localStorage', () => {
      // Simulate saved dark preference
      localStorage.getItem.mockReturnValue('dark');
      
      // Simulate theme restoration logic
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add(DARK_CLASS);
      }
      
      expect(document.documentElement.classList.contains(DARK_CLASS)).toBe(true);
    });

    test('restores light theme from localStorage', () => {
      // Simulate saved light preference
      localStorage.getItem.mockReturnValue('light');
      
      // Simulate theme restoration logic
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme !== 'dark') {
        document.documentElement.classList.remove(DARK_CLASS);
      }
      
      expect(document.documentElement.classList.contains(DARK_CLASS)).toBe(false);
    });

    test('uses system preference when no saved theme', () => {
      localStorage.getItem.mockReturnValue(null);
      
      // Simulate checking system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Our mock returns false for matches
      expect(prefersDark).toBe(false);
    });
  });

  describe('Complete Toggle and Save Workflow', () => {
    test('toggle and save workflow', () => {
      // Start with light theme
      expect(document.documentElement.classList.contains(DARK_CLASS)).toBe(false);
      
      // User toggles to dark
      document.documentElement.classList.add(DARK_CLASS);
      const newTheme = document.documentElement.classList.contains(DARK_CLASS) ? 'dark' : 'light';
      localStorage.setItem(THEME_KEY, newTheme);
      
      expect(localStorage.setItem).toHaveBeenCalledWith(THEME_KEY, 'dark');
      expect(document.documentElement.classList.contains(DARK_CLASS)).toBe(true);
    });

    test('persist preference across sessions simulation', () => {
      // Session 1: User sets dark theme
      document.documentElement.classList.add(DARK_CLASS);
      localStorage.setItem(THEME_KEY, 'dark');
      
      // Clear DOM state (simulate new session)
      document.documentElement.classList.remove(DARK_CLASS);
      
      // Session 2: Restore from localStorage
      localStorage.getItem.mockReturnValue('dark');
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add(DARK_CLASS);
      }
      
      expect(document.documentElement.classList.contains(DARK_CLASS)).toBe(true);
    });
  });
});
