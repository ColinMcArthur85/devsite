/**
 * Filter View Unit Tests
 * 
 * Tests for the FilterView component that renders filter badges
 * and handles filter toggle interactions.
 */

import { FilterView } from './filter-view.js';
import { createFilterState } from '../state/filter-state.js';

describe('FilterView', () => {
  let container;
  let mockOnToggle;
  let filterState;

  beforeEach(() => {
    // Create a fresh container for each test
    container = document.createElement('div');
    document.body.appendChild(container);
    mockOnToggle = jest.fn();
    filterState = createFilterState();
  });

  afterEach(() => {
    // Clean up
    document.body.removeChild(container);
  });

  describe('initialization', () => {
    test('creates a filter view instance', () => {
      const view = FilterView(container, 'tech', mockOnToggle);
      expect(view).toBeDefined();
      expect(typeof view.render).toBe('function');
    });
  });

  describe('render', () => {
    test('creates badges for each filter item', () => {
      const view = FilterView(container, 'tech', mockOnToggle);
      view.render(['React', 'Vue', 'Angular'], filterState);
      
      const badges = container.querySelectorAll('.badge');
      expect(badges).toHaveLength(3);
    });

    test('sets correct text for each badge', () => {
      const view = FilterView(container, 'tech', mockOnToggle);
      view.render(['React', 'Vue'], filterState);
      
      const badges = container.querySelectorAll('.badge');
      expect(badges[0].textContent).toBe('React');
      expect(badges[1].textContent).toBe('Vue');
    });

    test('clears previous badges on re-render', () => {
      const view = FilterView(container, 'tech', mockOnToggle);
      view.render(['React', 'Vue'], filterState);
      view.render(['Angular'], filterState);
      
      const badges = container.querySelectorAll('.badge');
      expect(badges).toHaveLength(1);
      expect(badges[0].textContent).toBe('Angular');
    });

    test('handles empty items array', () => {
      const view = FilterView(container, 'tech', mockOnToggle);
      view.render([], filterState);
      
      const badges = container.querySelectorAll('.badge');
      expect(badges).toHaveLength(0);
    });

    test('marks active filters with is-active class', () => {
      const activeState = createFilterState({ tech: ['React'] });
      const view = FilterView(container, 'tech', mockOnToggle);
      view.render(['React', 'Vue'], activeState);
      
      const badges = container.querySelectorAll('.badge');
      expect(badges[0].classList.contains('is-active')).toBe(true);
      expect(badges[1].classList.contains('is-active')).toBe(false);
    });
  });

  describe('data attributes', () => {
    test('sets data-filter-group attribute', () => {
      const view = FilterView(container, 'tech', mockOnToggle);
      view.render(['React'], filterState);
      
      const badge = container.querySelector('.badge');
      expect(badge.dataset.filterGroup).toBe('tech');
    });

    test('sets data-filter-value attribute', () => {
      const view = FilterView(container, 'tech', mockOnToggle);
      view.render(['React'], filterState);
      
      const badge = container.querySelector('.badge');
      expect(badge.dataset.filterValue).toBe('React');
    });
  });

  describe('ARIA attributes', () => {
    test('sets role="switch" on badges', () => {
      const view = FilterView(container, 'tech', mockOnToggle);
      view.render(['React'], filterState);
      
      const badge = container.querySelector('.badge');
      expect(badge.getAttribute('role')).toBe('switch');
    });

    test('sets aria-pressed="false" for inactive filters', () => {
      const view = FilterView(container, 'tech', mockOnToggle);
      view.render(['React'], filterState);
      
      const badge = container.querySelector('.badge');
      expect(badge.getAttribute('aria-pressed')).toBe('false');
    });

    test('sets aria-pressed="true" for active filters', () => {
      const activeState = createFilterState({ tech: ['React'] });
      const view = FilterView(container, 'tech', mockOnToggle);
      view.render(['React'], activeState);
      
      const badge = container.querySelector('.badge');
      expect(badge.getAttribute('aria-pressed')).toBe('true');
    });
  });

  describe('click handling', () => {
    test('calls onToggle when badge is clicked', () => {
      const view = FilterView(container, 'tech', mockOnToggle);
      view.render(['React'], filterState);
      
      const badge = container.querySelector('.badge');
      badge.click();
      
      expect(mockOnToggle).toHaveBeenCalledWith('React', true);
    });

    test('toggles is-active class on click', () => {
      const view = FilterView(container, 'tech', mockOnToggle);
      view.render(['React'], filterState);
      
      const badge = container.querySelector('.badge');
      expect(badge.classList.contains('is-active')).toBe(false);
      
      badge.click();
      expect(badge.classList.contains('is-active')).toBe(true);
      
      badge.click();
      expect(badge.classList.contains('is-active')).toBe(false);
    });

    test('updates aria-pressed on click', () => {
      const view = FilterView(container, 'tech', mockOnToggle);
      view.render(['React'], filterState);
      
      const badge = container.querySelector('.badge');
      expect(badge.getAttribute('aria-pressed')).toBe('false');
      
      badge.click();
      expect(badge.getAttribute('aria-pressed')).toBe('true');
    });

    test('does not call onToggle when clicking outside badges', () => {
      const view = FilterView(container, 'tech', mockOnToggle);
      view.render(['React'], filterState);
      
      container.click();
      
      expect(mockOnToggle).not.toHaveBeenCalled();
    });
  });

  describe('filter-pill class', () => {
    test('adds filter-pill class to badges', () => {
      const view = FilterView(container, 'tech', mockOnToggle);
      view.render(['React'], filterState);
      
      const badge = container.querySelector('.badge');
      expect(badge.classList.contains('filter-pill')).toBe(true);
    });
  });
});
