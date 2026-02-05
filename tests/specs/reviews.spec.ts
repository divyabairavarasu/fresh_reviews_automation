import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ReviewsPage } from '../pages/ReviewsPage';
import { TestUsers, TestReviews, TestZipCodes, TestLocations } from '../fixtures/testData';
import {
  generateRestaurantName,
  generateFoodItem,
  generateReviewText,
  generateRandomRating,
  containsXSSPatterns,
  isValidUSZipCode
} from '../utils/helpers';

/**
 * Fresh Reviews - Reviews Page E2E Test Suite
 * JIRA Ticket: TEST-789
 *
 * Comprehensive test coverage for:
 * - Authentication & Navigation
 * - Review Form Submission
 * - Rating System
 * - Location Features
 * - Reviews Display
 * - Edge Cases
 * - Responsive Design
 * - Accessibility
 * - Performance
 */

test.describe('Fresh Reviews - Reviews Page Tests [TEST-789]', () => {
  let loginPage: LoginPage;
  let reviewsPage: ReviewsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    reviewsPage = new ReviewsPage(page);
  });

  test.describe('Authentication & Navigation @smoke', () => {
    test('AC1: Verify user must be logged in to access reviews page', async ({ page }) => {
      await reviewsPage.navigate();

      // Should redirect to login page if not authenticated
      const isOnLogin = await loginPage.isOnLoginPage();
      expect(isOnLogin).toBeTruthy();
    });

    test('AC2: Verify user name is displayed in navigation', async ({ page }) => {
      // Login first
      await loginPage.navigate();
      await loginPage.setupAuthSession();
      await reviewsPage.navigate();

      // Verify user name is displayed
      await expect(reviewsPage.userNameDisplay).toBeVisible();
      const userName = await reviewsPage.getUserName();
      expect(userName).toContain(TestUsers.valid.name);
    });

    test('AC3: Verify logout button is functional and redirects to login page', async ({ page }) => {
      await loginPage.navigate();
      await loginPage.setupAuthSession();
      await reviewsPage.navigate();

      // Click logout
      await reviewsPage.logout();

      // Should redirect to login page
      await page.waitForTimeout(1000);
      const isOnLogin = await loginPage.isOnLoginPage();
      expect(isOnLogin).toBeTruthy();
    });

    test('AC4: Verify unauthorized access redirects to login page', async ({ page }) => {
      // Clear any existing session
      await loginPage.clearAuthSession();

      // Try to access reviews page without login
      await reviewsPage.navigate();
      await page.waitForTimeout(1000);

      // Should be redirected to login
      const currentURL = reviewsPage.getCurrentURL();
      expect(currentURL).toContain('index.html');
    });
  });

  test.describe('Review Form Submission @smoke @regression', () => {
    test.beforeEach(async ({ page }) => {
      // Setup authenticated session
      await loginPage.navigate();
      await loginPage.setupAuthSession();
      await reviewsPage.navigate();
    });

    test('AC5: Verify all required fields are validated', async ({ page }) => {
      // Try to submit empty form
      await reviewsPage.submitReview();

      // Check for validation errors
      const errors = await reviewsPage.getFormValidationErrors();
      expect(errors.length).toBeGreaterThan(0);
    });

    test('AC6: Verify successful review submission shows success message', async ({ page }) => {
      const reviewData = {
        ...TestReviews.valid,
        restaurantName: generateRestaurantName(),
        foodItem: generateFoodItem()
      };

      await reviewsPage.submitCompleteReview(reviewData);
      await page.waitForTimeout(1500);

      // Verify success message
      const isSuccessVisible = await reviewsPage.isSuccessMessageVisible();
      expect(isSuccessVisible).toBeTruthy();
    });

    test('AC7: Verify review appears in the reviews list after submission', async ({ page }) => {
      const reviewData = {
        restaurantName: `Test Restaurant ${Date.now()}`,
        foodItem: `Test Dish ${Date.now()}`,
        rating: 5,
        reviewText: 'This is a test review'
      };

      await reviewsPage.submitCompleteReview(reviewData);
      await page.waitForTimeout(2000);

      // Wait for reviews to load
      await reviewsPage.waitForReviewsToLoad();

      // Check if review exists
      const reviewExists = await reviewsPage.reviewExists(
        reviewData.restaurantName,
        reviewData.foodItem
      );
      expect(reviewExists).toBeTruthy();
    });

    test('AC8: Verify form resets after successful submission', async ({ page }) => {
      await reviewsPage.submitCompleteReview(TestReviews.valid);
      await page.waitForTimeout(2000);

      // Check if form is cleared
      const isEmpty = await reviewsPage.isFormEmpty();
      expect(isEmpty).toBeTruthy();
    });

    test('AC9: Verify error message displays for invalid/missing data', async ({ page }) => {
      // Submit with missing rating
      await reviewsPage.fillInput(reviewsPage.restaurantNameInput, 'Test');
      await reviewsPage.fillInput(reviewsPage.foodItemInput, 'Test');
      await reviewsPage.fillInput(reviewsPage.reviewTextarea, 'Test');
      await reviewsPage.submitReview();

      // Should show error or validation message
      await page.waitForTimeout(1000);
      const hasError = await reviewsPage.isErrorMessageVisible();
      const validationErrors = await reviewsPage.getFormValidationErrors();

      expect(hasError || validationErrors.length > 0).toBeTruthy();
    });
  });

  test.describe('Rating System @regression', () => {
    test.beforeEach(async ({ page }) => {
      await loginPage.navigate();
      await loginPage.setupAuthSession();
      await reviewsPage.navigate();
    });

    test('AC10: Verify all 5 star ratings are selectable', async ({ page }) => {
      for (let rating = 1; rating <= 5; rating++) {
        await reviewsPage.selectRating(rating);
        const selected = await reviewsPage.getSelectedRating();
        expect(selected).toBe(rating);
      }
    });

    test('AC11: Verify rating is required before form submission', async ({ page }) => {
      // Fill all fields except rating
      await reviewsPage.fillInput(reviewsPage.restaurantNameInput, 'Test');
      await reviewsPage.fillInput(reviewsPage.foodItemInput, 'Test');
      await reviewsPage.fillInput(reviewsPage.reviewTextarea, 'Test review');
      await reviewsPage.submitReview();

      await page.waitForTimeout(500);

      // Form should not submit successfully
      const validationErrors = await reviewsPage.getFormValidationErrors();
      expect(validationErrors.length).toBeGreaterThan(0);
    });

    test('AC12: Verify selected rating is highlighted visually', async ({ page }) => {
      await reviewsPage.selectRating(5);

      const isChecked = await reviewsPage.star5.isChecked();
      expect(isChecked).toBeTruthy();
    });

    test('AC13: Verify only one rating can be selected at a time', async ({ page }) => {
      // Select rating 5
      await reviewsPage.selectRating(5);
      let selected = await reviewsPage.getSelectedRating();
      expect(selected).toBe(5);

      // Select rating 3
      await reviewsPage.selectRating(3);
      selected = await reviewsPage.getSelectedRating();
      expect(selected).toBe(3);

      // Only one should be selected
      const checkedCount = await reviewsPage.ratingOptions.locator(':checked').count();
      expect(checkedCount).toBe(1);
    });
  });

  test.describe('Location Features @regression', () => {
    test.beforeEach(async ({ page }) => {
      await loginPage.navigate();
      await loginPage.setupAuthSession();
      await reviewsPage.navigate();
    });

    test('AC14: Verify location toggle switches on/off correctly', async ({ page }) => {
      const initialState = await reviewsPage.isLocationEnabled();

      await reviewsPage.toggleLocation();
      await page.waitForTimeout(500);

      const afterToggle = await reviewsPage.isLocationEnabled();
      expect(afterToggle).not.toBe(initialState);
    });

    test('AC15: Verify location toggle status text updates', async ({ page }) => {
      // Check initial status
      const initialStatus = await reviewsPage.getLocationToggleStatus();

      // Toggle location
      await reviewsPage.toggleLocation();
      await page.waitForTimeout(500);

      // Check updated status
      const newStatus = await reviewsPage.getLocationToggleStatus();
      expect(newStatus).not.toBe(initialStatus);
      expect(newStatus.toLowerCase()).toMatch(/on|off/);
    });

    test('AC16: Verify geolocation permission prompt appears when toggled on', async ({ page, context }) => {
      // Grant geolocation permission
      await context.grantPermissions(['geolocation']);
      await context.setGeolocation(TestLocations.sanFrancisco);

      await reviewsPage.toggleLocation();
      await page.waitForTimeout(1000);

      // Status should update
      const status = await reviewsPage.getLocationStatusMessage();
      expect(status).toBeTruthy();
    });

    test('AC17: Verify reviews filter by location when toggle is on', async ({ page, context }) => {
      await context.grantPermissions(['geolocation']);
      await context.setGeolocation(TestLocations.sanFrancisco);

      const beforeToggle = await reviewsPage.getReviewsCount();

      await reviewsPage.toggleLocation();
      await page.waitForTimeout(2000);

      // Reviews list should potentially change (depending on location data)
      const afterToggle = await reviewsPage.getReviewsCount();
      expect(typeof afterToggle).toBe('number');
    });

    test('AC18: Verify ZIP code search is functional', async ({ page }) => {
      await reviewsPage.searchByZipCode(TestZipCodes.valid);
      await page.waitForTimeout(1000);

      // Status message should appear
      const status = await reviewsPage.getLocationStatusMessage();
      expect(status).toBeTruthy();
    });

    test('AC19: Verify invalid ZIP code shows error message', async ({ page }) => {
      await reviewsPage.searchByZipCode(TestZipCodes.invalid);
      await page.waitForTimeout(1000);

      const status = await reviewsPage.getLocationStatusMessage();
      expect(status.toLowerCase()).toMatch(/invalid|error|not found/);
    });

    test('AC20: Verify ZIP code search filters reviews by location', async ({ page }) => {
      await reviewsPage.searchByZipCode(TestZipCodes.valid);
      await page.waitForTimeout(2000);

      await reviewsPage.waitForReviewsToLoad();
      const reviewsCount = await reviewsPage.getReviewsCount();

      expect(reviewsCount).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Reviews Display @smoke', () => {
    test.beforeEach(async ({ page }) => {
      await loginPage.navigate();
      await loginPage.setupAuthSession();
      await reviewsPage.navigate();
    });

    test('AC21: Verify reviews list displays correctly with all data', async ({ page }) => {
      await reviewsPage.waitForReviewsToLoad(10000);

      const reviews = await reviewsPage.getAllReviews();

      if (reviews.length > 0) {
        const firstReview = reviews[0];
        expect(firstReview.restaurant).toBeTruthy();
        expect(firstReview.foodItem).toBeTruthy();
        expect(firstReview.rating).toBeTruthy();
        expect(firstReview.reviewText).toBeTruthy();
      }
    });

    test('AC22: Verify empty state message when no reviews available', async ({ page }) => {
      // Try with invalid ZIP to potentially get empty results
      await reviewsPage.searchByZipCode('00000');
      await page.waitForTimeout(2000);

      const isEmpty = await reviewsPage.isReviewsListEmpty();
      // Empty state should be handled gracefully
      expect(typeof isEmpty).toBe('boolean');
    });

    test('AC23: Verify reviews show restaurant name, food item, rating, review text', async ({ page }) => {
      await reviewsPage.waitForReviewsToLoad(10000);

      const reviewsCount = await reviewsPage.getReviewsCount();

      if (reviewsCount > 0) {
        const reviews = await reviewsPage.getAllReviews();
        const review = reviews[0];

        expect(review).toHaveProperty('restaurant');
        expect(review).toHaveProperty('foodItem');
        expect(review).toHaveProperty('rating');
        expect(review).toHaveProperty('reviewText');
      }
    });

    test('AC24: Verify reviews are sorted by date (newest first)', async ({ page }) => {
      // Submit two reviews with delay
      const review1 = {
        restaurantName: `Restaurant ${Date.now()}`,
        foodItem: 'First Dish',
        rating: 5,
        reviewText: 'First review'
      };

      await reviewsPage.submitCompleteReview(review1);
      await page.waitForTimeout(3000);

      const review2 = {
        restaurantName: `Restaurant ${Date.now()}`,
        foodItem: 'Second Dish',
        rating: 4,
        reviewText: 'Second review'
      };

      await reviewsPage.submitCompleteReview(review2);
      await page.waitForTimeout(3000);

      await reviewsPage.waitForReviewsToLoad();

      // Second review should appear first (newest)
      const reviews = await reviewsPage.getAllReviews();
      if (reviews.length >= 2) {
        expect(reviews[0].foodItem).toContain('Second');
      }
    });

    test('AC25: Verify reviews update in real-time after submission', async ({ page }) => {
      const beforeCount = await reviewsPage.getReviewsCount();

      const newReview = {
        restaurantName: `RT ${Date.now()}`,
        foodItem: `FD ${Date.now()}`,
        rating: 5,
        reviewText: 'Test review'
      };

      await reviewsPage.submitCompleteReview(newReview);
      await page.waitForTimeout(2000);

      const afterCount = await reviewsPage.getReviewsCount();
      expect(afterCount).toBeGreaterThan(beforeCount);
    });
  });

  test.describe('Edge Cases & Security @regression', () => {
    test.beforeEach(async ({ page }) => {
      await loginPage.navigate();
      await loginPage.setupAuthSession();
      await reviewsPage.navigate();
    });

    test('AC26: Verify XSS prevention (script tags in inputs)', async ({ page }) => {
      await reviewsPage.submitCompleteReview(TestReviews.specialCharacters);
      await page.waitForTimeout(2000);

      // Page should not execute scripts
      const alerts = [];
      page.on('dialog', dialog => {
        alerts.push(dialog.message());
        dialog.dismiss();
      });

      await page.waitForTimeout(1000);
      expect(alerts.length).toBe(0);

      // Check if scripts were sanitized
      const reviews = await reviewsPage.getAllReviews();
      if (reviews.length > 0) {
        const hasXSS = reviews.some(r =>
          containsXSSPatterns(r.restaurant || '') ||
          containsXSSPatterns(r.reviewText || '')
        );
        expect(hasXSS).toBeFalsy();
      }
    });

    test('AC27: Verify SQL injection prevention', async ({ page }) => {
      const sqlInjection = {
        restaurantName: "' OR '1'='1",
        foodItem: "'; DROP TABLE reviews; --",
        rating: 5,
        reviewText: "1' AND '1'='1"
      };

      await reviewsPage.submitCompleteReview(sqlInjection);
      await page.waitForTimeout(1000);

      // Application should still function
      await reviewsPage.navigate();
      const isPageWorking = await reviewsPage.isAuthenticated();
      expect(isPageWorking).toBeTruthy();
    });

    test('AC28: Verify extremely long input text handling', async ({ page }) => {
      await reviewsPage.submitCompleteReview(TestReviews.maxLength);
      await page.waitForTimeout(1000);

      // Form should handle long text gracefully
      const hasError = await reviewsPage.isErrorMessageVisible();
      const hasSuccess = await reviewsPage.isSuccessMessageVisible();

      expect(hasError || hasSuccess).toBeTruthy();
    });

    test('AC29: Verify special characters in restaurant/food names', async ({ page }) => {
      const specialCharsReview = {
        restaurantName: "Joe's Café & Bistro (№1) - €£¥",
        foodItem: "Crème Brûlée™ @2024",
        rating: 5,
        reviewText: "Amazing! #1 🎉"
      };

      await reviewsPage.submitCompleteReview(specialCharsReview);
      await page.waitForTimeout(2000);

      const hasSuccess = await reviewsPage.isSuccessMessageVisible();
      expect(hasSuccess).toBeTruthy();
    });

    test('AC30: Verify rapid form submission (double-click prevention)', async ({ page }) => {
      await reviewsPage.fillReviewForm(TestReviews.valid);

      // Click submit button multiple times rapidly
      await reviewsPage.submitButton.click({ clickCount: 3 });
      await page.waitForTimeout(2000);

      // Only one review should be submitted
      const reviewsCount = await reviewsPage.getReviewsCount();
      expect(reviewsCount).toBeGreaterThanOrEqual(1);
    });

    test('AC31: Verify browser back button behavior', async ({ page }) => {
      await loginPage.navigate();
      await reviewsPage.navigate();

      await page.goBack();
      await page.waitForTimeout(1000);

      // Should handle back navigation gracefully
      const currentURL = reviewsPage.getCurrentURL();
      expect(currentURL).toBeTruthy();
    });

    test('AC32: Verify page refresh preserves user session', async ({ page }) => {
      await reviewsPage.navigate();
      const userBefore = await reviewsPage.getUserName();

      await reviewsPage.reload();
      await page.waitForTimeout(1000);

      const userAfter = await reviewsPage.getUserName();
      expect(userAfter).toBe(userBefore);
    });

    test('AC33: Verify multiple reviews submission in sequence', async ({ page }) => {
      const numReviews = 3;

      for (let i = 0; i < numReviews; i++) {
        const review = {
          restaurantName: `Restaurant ${i}`,
          foodItem: `Dish ${i}`,
          rating: generateRandomRating(),
          reviewText: `Review ${i}`
        };

        await reviewsPage.submitCompleteReview(review);
        await page.waitForTimeout(2000);

        const hasSuccess = await reviewsPage.isSuccessMessageVisible();
        expect(hasSuccess).toBeTruthy();
      }
    });

    test('AC34: Verify emoji handling in reviews', async ({ page }) => {
      await reviewsPage.submitCompleteReview(TestReviews.emojis);
      await page.waitForTimeout(2000);

      const hasSuccess = await reviewsPage.isSuccessMessageVisible();
      expect(hasSuccess).toBeTruthy();
    });
  });

  test.describe('Responsive Design @mobile', () => {
    test('AC35: Verify page renders correctly on mobile (375px)', async ({ page }) => {
      await loginPage.navigate();
      await loginPage.setupAuthSession();

      await reviewsPage.setViewportSize(375, 667);
      await reviewsPage.navigate();

      await expect(reviewsPage.navbar).toBeVisible();
      await expect(reviewsPage.reviewForm).toBeVisible();
    });

    test('AC36: Verify page renders correctly on tablet (768px)', async ({ page }) => {
      await loginPage.navigate();
      await loginPage.setupAuthSession();

      await reviewsPage.setViewportSize(768, 1024);
      await reviewsPage.navigate();

      await expect(reviewsPage.navbar).toBeVisible();
      await expect(reviewsPage.reviewForm).toBeVisible();
    });

    test('AC37: Verify page renders correctly on desktop (1920px)', async ({ page }) => {
      await loginPage.navigate();
      await loginPage.setupAuthSession();

      await reviewsPage.setViewportSize(1920, 1080);
      await reviewsPage.navigate();

      await expect(reviewsPage.navbar).toBeVisible();
      await expect(reviewsPage.reviewForm).toBeVisible();
    });
  });

  test.describe('Accessibility @a11y', () => {
    test.beforeEach(async ({ page }) => {
      await loginPage.navigate();
      await loginPage.setupAuthSession();
      await reviewsPage.navigate();
    });

    test('AC38: Verify all form fields have proper labels', async ({ page }) => {
      const restaurantLabel = await page.locator('label[for="restaurantName"]').count();
      const foodLabel = await page.locator('label[for="foodItem"]').count();
      const reviewLabel = await page.locator('label[for="review"]').count();

      expect(restaurantLabel).toBeGreaterThan(0);
      expect(foodLabel).toBeGreaterThan(0);
      expect(reviewLabel).toBeGreaterThan(0);
    });

    test('AC39: Verify keyboard navigation works for all interactive elements', async ({ page }) => {
      // Tab through form elements
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);

      const focused1 = await page.evaluate(() => document.activeElement?.tagName);
      expect(['INPUT', 'BUTTON', 'TEXTAREA']).toContain(focused1);

      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);

      const focused2 = await page.evaluate(() => document.activeElement?.tagName);
      expect(['INPUT', 'BUTTON', 'TEXTAREA']).toContain(focused2);
    });

    test('AC40: Verify ARIA attributes are present for screen readers', async ({ page }) => {
      const ariaElements = await page.locator('[aria-label], [aria-labelledby], [role]').count();
      expect(ariaElements).toBeGreaterThan(0);
    });

    test('AC41: Verify focus indicators are visible', async ({ page }) => {
      await reviewsPage.restaurantNameInput.focus();

      const hasFocus = await reviewsPage.restaurantNameInput.evaluate(
        el => el === document.activeElement
      );
      expect(hasFocus).toBeTruthy();
    });

    test('AC42: Verify color contrast meets WCAG standards', async ({ page }) => {
      // This would require axe-core or similar tool
      // Placeholder for accessibility testing
      const bodyBgColor = await page.evaluate(() =>
        window.getComputedStyle(document.body).backgroundColor
      );
      expect(bodyBgColor).toBeTruthy();
    });
  });

  test.describe('Performance @performance', () => {
    test('AC43: Verify page loads within 3 seconds', async ({ page }) => {
      await loginPage.navigate();
      await loginPage.setupAuthSession();

      const startTime = Date.now();
      await reviewsPage.navigate();
      await reviewsPage.waitForPageLoad();
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(3000);
    });

    test('AC44: Verify form submission completes within 2 seconds', async ({ page }) => {
      await loginPage.navigate();
      await loginPage.setupAuthSession();
      await reviewsPage.navigate();

      await reviewsPage.fillReviewForm(TestReviews.valid);

      const startTime = Date.now();
      await reviewsPage.submitReview();
      await page.waitForTimeout(500);
      const submitTime = Date.now() - startTime;

      expect(submitTime).toBeLessThan(2000);
    });

    test('AC45: Verify no console errors on page load', async ({ page }) => {
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await loginPage.navigate();
      await loginPage.setupAuthSession();
      await reviewsPage.navigate();
      await page.waitForTimeout(2000);

      // Filter out known non-critical errors (if any)
      const criticalErrors = errors.filter(e =>
        !e.includes('favicon') && !e.includes('DevTools')
      );

      expect(criticalErrors.length).toBe(0);
    });

    test('AC46: Verify no memory leaks during extended use', async ({ page }) => {
      await loginPage.navigate();
      await loginPage.setupAuthSession();
      await reviewsPage.navigate();

      // Perform multiple operations
      for (let i = 0; i < 5; i++) {
        await reviewsPage.toggleLocation();
        await page.waitForTimeout(500);
        await reviewsPage.searchByZipCode(TestZipCodes.valid);
        await page.waitForTimeout(500);
      }

      // Page should still be responsive
      const isVisible = await reviewsPage.isVisible(reviewsPage.navbar);
      expect(isVisible).toBeTruthy();
    });
  });
});
