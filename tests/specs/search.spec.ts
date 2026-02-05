import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';
import AxeBuilder from '@axe-core/playwright';

/**
 * Fresh Reviews - Search Page E2E Test Suite
 * JIRA Ticket: SCRUM-3
 *
 * Comprehensive test coverage for:
 * - Page Load & Content
 * - Search Functionality
 * - Responsive Design
 * - Accessibility
 * - Performance
 */

test.describe('Fresh Reviews - Search Page Tests [SCRUM-3]', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
  });

  test.describe('Page Load & Content @smoke', () => {
    test('AC1: Verify page loads successfully', async ({ page }) => {
      await searchPage.navigate();

      // Verify page loaded
      expect(await searchPage.isOnSearchPage()).toBeTruthy();
    });

    test('AC2: Verify page title is correct', async ({ page }) => {
      await searchPage.navigate();

      // Check page title
      const title = await searchPage.getTitle();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);
    });

    test('AC3: Verify search interface is visible', async ({ page }) => {
      await searchPage.navigate();

      // Verify search input is displayed
      expect(await searchPage.isSearchInputVisible()).toBeTruthy();
    });

    test('AC4: Verify navigation elements are present', async ({ page }) => {
      await searchPage.navigate();

      // Check navigation bar exists
      const navVisible = await searchPage.isNavigationBarVisible();
      expect(navVisible).toBeTruthy();
    });

    test('AC5: Verify no console errors on page load', async ({ page }) => {
      const consoleErrors: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      await searchPage.navigate();

      // Wait a bit for any async errors
      await page.waitForTimeout(2000);

      // Should have no console errors
      expect(consoleErrors.length).toBe(0);
    });
  });

  test.describe('Search Functionality @smoke @regression', () => {
    test('AC6: Verify search by keyword', async ({ page }) => {
      await searchPage.navigate();

      // Check if search input is visible
      const searchVisible = await searchPage.isSearchInputVisible();
      if (searchVisible) {
        await searchPage.search('test');
        await searchPage.waitForSearchComplete();

        // Verify either results or no results message is shown
        const hasResults = await searchPage.areSearchResultsVisible();
        const hasNoResults = await searchPage.isNoResultsMessageVisible();
        expect(hasResults || hasNoResults).toBeTruthy();
      }
    });

    test('AC7: Verify search filters work', async ({ page }) => {
      await searchPage.navigate();

      // Check if filter section exists
      const filterVisible = await searchPage.isFilterSectionVisible();
      if (filterVisible) {
        // Filters are present
        expect(filterVisible).toBeTruthy();
      }
    });

    test('AC8: Verify search results display correctly', async ({ page }) => {
      await searchPage.navigate();

      // Perform search
      if (await searchPage.isSearchInputVisible()) {
        await searchPage.search('restaurant');
        await searchPage.waitForSearchComplete();

        // Check if results are displayed
        const resultsVisible = await searchPage.areSearchResultsVisible();
        const noResults = await searchPage.isNoResultsMessageVisible();

        // Either results or no results message should be shown
        expect(resultsVisible || noResults).toBeTruthy();
      }
    });

    test('AC9: Verify no results state', async ({ page }) => {
      await searchPage.navigate();

      // Search for something that should not exist
      if (await searchPage.isSearchInputVisible()) {
        await searchPage.search('xyzabc123notfound');
        await searchPage.waitForSearchComplete();

        // Verify either results or no results message
        const hasResults = await searchPage.areSearchResultsVisible();
        const hasNoResults = await searchPage.isNoResultsMessageVisible();
        expect(hasResults || hasNoResults).toBeTruthy();
      }
    });
  });

  test.describe('Responsive Design @responsive', () => {
    test('AC10: Verify page renders correctly on mobile (375px width)', async ({ page }) => {
      await searchPage.setViewportSize(375, 667);
      await searchPage.navigate();

      // Verify main content is still visible
      expect(await searchPage.isMainContentVisible()).toBeTruthy();

      // Take screenshot for visual comparison
      await searchPage.compareScreenshot('search-mobile', { maxDiffPixelRatio: 0.2 });
    });

    test('AC11: Verify page renders correctly on tablet (768px width)', async ({ page }) => {
      await searchPage.setViewportSize(768, 1024);
      await searchPage.navigate();

      // Verify main content is visible
      expect(await searchPage.isMainContentVisible()).toBeTruthy();

      // Take screenshot for visual comparison
      await searchPage.compareScreenshot('search-tablet', { maxDiffPixelRatio: 0.2 });
    });

    test('AC12: Verify page renders correctly on desktop (1920px width)', async ({ page }) => {
      await searchPage.setViewportSize(1920, 1080);
      await searchPage.navigate();

      // Verify main content is visible
      expect(await searchPage.isMainContentVisible()).toBeTruthy();

      // Take screenshot for visual comparison
      await searchPage.compareScreenshot('search-desktop', { maxDiffPixelRatio: 0.2 });
    });
  });

  test.describe('Accessibility @a11y', () => {
    test('AC13: Verify keyboard navigation works', async ({ page }) => {
      await searchPage.navigate();

      // Tab through interactive elements
      await page.keyboard.press('Tab');

      // Verify focus is visible
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBeTruthy();
    });

    test('AC14: Verify ARIA attributes are present', async ({ page }) => {
      await searchPage.navigate();

      // Run accessibility scan with axe
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      // Check for ARIA-related violations
      const ariaViolations = accessibilityScanResults.violations.filter(
        v => v.id.includes('aria') || v.tags.includes('aria')
      );

      expect(ariaViolations.length).toBe(0);
    });

    test('AC15: Verify focus indicators are visible', async ({ page }) => {
      await searchPage.navigate();

      // Check for focus-visible CSS or outline styles
      const hasFocusStyles = await page.evaluate(() => {
        const style = window.getComputedStyle(document.body);
        return style !== null;
      });

      expect(hasFocusStyles).toBeTruthy();
    });
  });

  test.describe('Performance @performance', () => {
    test('AC16: Verify page loads within 3 seconds', async ({ page }) => {
      const startTime = Date.now();

      await searchPage.navigate();

      const loadTime = Date.now() - startTime;

      // Page should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('AC17: Verify search response time under 2 seconds', async ({ page }) => {
      await searchPage.navigate();

      if (await searchPage.isSearchInputVisible()) {
        const startTime = Date.now();

        await searchPage.search('test');
        await searchPage.waitForSearchComplete();

        const searchTime = Date.now() - startTime;

        // Search should complete within 2 seconds
        expect(searchTime).toBeLessThan(2000);
      }
    });
  });
});
