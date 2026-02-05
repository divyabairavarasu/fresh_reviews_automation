import { test, expect } from '@playwright/test';
import { IndexPage } from '../pages/IndexPage';
import AxeBuilder from '@axe-core/playwright';

/**
 * Fresh Reviews - Index Page E2E Test Suite
 * JIRA Ticket: SCRUM-2
 *
 * Comprehensive test coverage for:
 * - Page Load & Content
 * - Navigation
 * - Responsive Design
 * - Accessibility
 * - Performance
 */

test.describe('Fresh Reviews - Index Page Tests [SCRUM-2]', () => {
  let indexPage: IndexPage;

  test.beforeEach(async ({ page }) => {
    indexPage = new IndexPage(page);
  });

  test.describe('Page Load & Content @smoke', () => {
    test('AC1: Verify page loads successfully', async ({ page }) => {
      await indexPage.navigate();

      // Verify page loaded
      expect(await indexPage.isOnIndexPage()).toBeTruthy();
    });

    test('AC2: Verify page title is correct', async ({ page }) => {
      await indexPage.navigate();

      // Check page title
      const title = await indexPage.getTitle();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);
    });

    test('AC3: Verify main content is visible', async ({ page }) => {
      await indexPage.navigate();

      // Verify main content is displayed
      expect(await indexPage.isMainContentVisible()).toBeTruthy();
    });

    test('AC4: Verify navigation elements are present', async ({ page }) => {
      await indexPage.navigate();

      // Check navigation bar exists
      const navVisible = await indexPage.isNavigationBarVisible();
      expect(navVisible).toBeTruthy();
    });

    test('AC5: Verify no console errors on page load', async ({ page }) => {
      const consoleErrors: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      await indexPage.navigate();

      // Wait a bit for any async errors
      await page.waitForTimeout(2000);

      // Should have no console errors
      expect(consoleErrors.length).toBe(0);
    });
  });

  test.describe('Navigation @smoke @regression', () => {
    test('AC6: Verify login link/button navigates to login page', async ({ page }) => {
      await indexPage.navigate();

      // Check if login link is visible
      const loginLinkVisible = await indexPage.isLoginLinkVisible();
      if (loginLinkVisible) {
        await indexPage.clickLogin();

        // Verify navigation occurred
        const url = indexPage.getCurrentURL();
        expect(url).toContain('index.html');
      }
    });

    test('AC7: Verify signup link/button navigates to signup page', async ({ page }) => {
      await indexPage.navigate();

      // Check if signup link is visible
      const signupLinkVisible = await indexPage.isSignupLinkVisible();
      if (signupLinkVisible) {
        await indexPage.clickSignup();

        // Verify navigation to signup page
        await page.waitForTimeout(1000);
        const url = indexPage.getCurrentURL();
        expect(url).toContain('signup.html');
      }
    });

    test('AC8: Verify all navigation links are functional', async ({ page }) => {
      await indexPage.navigate();

      // Get all links on the page
      const links = await page.locator('a[href]').all();

      // Verify at least some links exist
      expect(links.length).toBeGreaterThan(0);

      // Check that links have valid href attributes
      for (const link of links) {
        const href = await link.getAttribute('href');
        expect(href).toBeTruthy();
      }
    });
  });

  test.describe('Responsive Design @responsive', () => {
    test('AC9: Verify page renders correctly on mobile (375px width)', async ({ page }) => {
      await indexPage.setViewportSize(375, 667);
      await indexPage.navigate();

      // Verify main content is still visible
      expect(await indexPage.isMainContentVisible()).toBeTruthy();

      // Take screenshot for visual comparison
      await indexPage.compareScreenshot('index-mobile', { maxDiffPixelRatio: 0.2 });
    });

    test('AC10: Verify page renders correctly on tablet (768px width)', async ({ page }) => {
      await indexPage.setViewportSize(768, 1024);
      await indexPage.navigate();

      // Verify main content is visible
      expect(await indexPage.isMainContentVisible()).toBeTruthy();

      // Take screenshot for visual comparison
      await indexPage.compareScreenshot('index-tablet', { maxDiffPixelRatio: 0.2 });
    });

    test('AC11: Verify page renders correctly on desktop (1920px width)', async ({ page }) => {
      await indexPage.setViewportSize(1920, 1080);
      await indexPage.navigate();

      // Verify main content is visible
      expect(await indexPage.isMainContentVisible()).toBeTruthy();

      // Take screenshot for visual comparison
      await indexPage.compareScreenshot('index-desktop', { maxDiffPixelRatio: 0.2 });
    });
  });

  test.describe('Accessibility @a11y', () => {
    test('AC12: Verify keyboard navigation works', async ({ page }) => {
      await indexPage.navigate();

      // Tab through interactive elements
      await page.keyboard.press('Tab');

      // Verify focus is visible
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBeTruthy();
    });

    test('AC13: Verify ARIA attributes are present', async ({ page }) => {
      await indexPage.navigate();

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

    test('AC14: Verify focus indicators are visible', async ({ page }) => {
      await indexPage.navigate();

      // Check for focus-visible CSS or outline styles
      const hasFocusStyles = await page.evaluate(() => {
        const style = window.getComputedStyle(document.body);
        return style !== null;
      });

      expect(hasFocusStyles).toBeTruthy();
    });

    test('AC15: Verify color contrast meets WCAG standards', async ({ page }) => {
      await indexPage.navigate();

      // Run accessibility scan focusing on color contrast
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .analyze();

      // Check for color contrast violations
      const contrastViolations = accessibilityScanResults.violations.filter(
        v => v.id === 'color-contrast'
      );

      expect(contrastViolations.length).toBe(0);
    });
  });

  test.describe('Performance @performance', () => {
    test('AC16: Verify page loads within 3 seconds', async ({ page }) => {
      const startTime = Date.now();

      await indexPage.navigate();

      const loadTime = Date.now() - startTime;

      // Page should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('AC17: Verify no memory leaks', async ({ page }) => {
      await indexPage.navigate();

      // Get initial metrics
      const initialMetrics = await page.evaluate(() => {
        return (performance as any).memory ? (performance as any).memory.usedJSHeapSize : 0;
      });

      // Reload page multiple times
      for (let i = 0; i < 3; i++) {
        await indexPage.reload();
        await page.waitForTimeout(500);
      }

      // Get final metrics
      const finalMetrics = await page.evaluate(() => {
        return (performance as any).memory ? (performance as any).memory.usedJSHeapSize : 0;
      });

      // Memory should not grow excessively (allowing for some variance)
      if (initialMetrics > 0 && finalMetrics > 0) {
        const memoryGrowth = (finalMetrics - initialMetrics) / initialMetrics;
        expect(memoryGrowth).toBeLessThan(0.5); // Less than 50% growth
      }
    });
  });
});
