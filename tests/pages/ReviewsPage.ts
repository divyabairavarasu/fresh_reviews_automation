import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Reviews Page Object Model
 * Handles all interactions on the reviews page
 * JIRA: TEST-789
 */
export class ReviewsPage extends BasePage {
  // Navigation elements
  readonly navbar: Locator;
  readonly userNameDisplay: Locator;
  readonly logoutButton: Locator;

  // Review form elements
  readonly reviewForm: Locator;
  readonly restaurantNameInput: Locator;
  readonly foodItemInput: Locator;
  readonly ratingOptions: Locator;
  readonly star5: Locator;
  readonly star4: Locator;
  readonly star3: Locator;
  readonly star2: Locator;
  readonly star1: Locator;
  readonly reviewTextarea: Locator;
  readonly submitButton: Locator;
  readonly reviewError: Locator;
  readonly reviewSuccess: Locator;

  // Location features
  readonly locationToggle: Locator;
  readonly toggleStatusText: Locator;
  readonly zipCodeInput: Locator;
  readonly searchZipButton: Locator;
  readonly locationStatus: Locator;

  // Reviews display
  readonly reviewsList: Locator;
  readonly reviewCards: Locator;
  readonly nearbyRestaurantsHeader: Locator;

  constructor(page: Page) {
    super(page);

    // Navigation
    this.navbar = page.locator('.navbar');
    this.userNameDisplay = page.locator('#userNameDisplay');
    this.logoutButton = page.locator('#logoutBtn');

    // Review form
    this.reviewForm = page.locator('#reviewForm');
    this.restaurantNameInput = page.locator('#restaurantName');
    this.foodItemInput = page.locator('#foodItem');
    this.ratingOptions = page.locator('input[name="rating"]');
    this.star5 = page.locator('#star5');
    this.star4 = page.locator('#star4');
    this.star3 = page.locator('#star3');
    this.star2 = page.locator('#star2');
    this.star1 = page.locator('#star1');
    this.reviewTextarea = page.locator('#review');
    this.submitButton = page.locator('button[type="submit"]');
    this.reviewError = page.locator('#reviewError');
    this.reviewSuccess = page.locator('#reviewSuccess');

    // Location
    this.locationToggle = page.locator('#locationToggle');
    this.toggleStatusText = page.locator('#toggleStatusText');
    this.zipCodeInput = page.locator('#zipCodeInput');
    this.searchZipButton = page.locator('#searchZipBtn');
    this.locationStatus = page.locator('#locationStatus');

    // Reviews display
    this.reviewsList = page.locator('#reviewsList');
    this.reviewCards = page.locator('.review-card, [data-testid="review-card"]');
    this.nearbyRestaurantsHeader = page.locator('.location-header h2');
  }

  /**
   * Navigate to reviews page
   */
  async navigate() {
    await this.goto('/reviews.html');
    await this.waitForPageLoad();
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    return await this.isVisible(this.logoutButton);
  }

  /**
   * Get displayed user name
   */
  async getUserName(): Promise<string> {
    return await this.getText(this.userNameDisplay);
  }

  /**
   * Click logout button
   */
  async logout() {
    await this.clickElement(this.logoutButton);
    await this.waitForNavigation();
  }

  /**
   * Fill review form
   */
  async fillReviewForm(data: {
    restaurantName: string;
    foodItem: string;
    rating: number;
    reviewText: string;
  }) {
    await this.fillInput(this.restaurantNameInput, data.restaurantName);
    await this.fillInput(this.foodItemInput, data.foodItem);
    await this.selectRating(data.rating);
    await this.fillInput(this.reviewTextarea, data.reviewText);
  }

  /**
   * Select rating (1-5 stars)
   */
  async selectRating(rating: number) {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const ratingMap: { [key: number]: Locator } = {
      5: this.star5,
      4: this.star4,
      3: this.star3,
      2: this.star2,
      1: this.star1,
    };

    await ratingMap[rating].check();
  }

  /**
   * Get selected rating value
   */
  async getSelectedRating(): Promise<number | null> {
    const checkedRating = await this.ratingOptions.locator(':checked').getAttribute('value');
    return checkedRating ? parseInt(checkedRating) : null;
  }

  /**
   * Submit review form
   */
  async submitReview() {
    await this.clickElement(this.submitButton);
    await this.wait(1000); // Wait for submission processing
  }

  /**
   * Submit complete review
   */
  async submitCompleteReview(data: {
    restaurantName: string;
    foodItem: string;
    rating: number;
    reviewText: string;
  }) {
    await this.fillReviewForm(data);
    await this.submitReview();
  }

  /**
   * Check if success message is displayed
   */
  async isSuccessMessageVisible(): Promise<boolean> {
    return await this.isVisible(this.reviewSuccess);
  }

  /**
   * Get success message text
   */
  async getSuccessMessage(): Promise<string> {
    return await this.getText(this.reviewSuccess);
  }

  /**
   * Check if error message is displayed
   */
  async isErrorMessageVisible(): Promise<boolean> {
    return await this.isVisible(this.reviewError);
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.getText(this.reviewError);
  }

  /**
   * Check if form is empty
   */
  async isFormEmpty(): Promise<boolean> {
    const restaurantValue = await this.restaurantNameInput.inputValue();
    const foodValue = await this.foodItemInput.inputValue();
    const reviewValue = await this.reviewTextarea.inputValue();
    const rating = await this.getSelectedRating();

    return !restaurantValue && !foodValue && !reviewValue && !rating;
  }

  /**
   * Clear review form
   */
  async clearForm() {
    await this.restaurantNameInput.clear();
    await this.foodItemInput.clear();
    await this.reviewTextarea.clear();
    // Uncheck rating if checked
    const rating = await this.getSelectedRating();
    if (rating) {
      await this.page.evaluate(() => {
        const ratings = document.querySelectorAll('input[name="rating"]');
        ratings.forEach((r: any) => r.checked = false);
      });
    }
  }

  /**
   * Toggle location feature
   */
  async toggleLocation() {
    await this.clickElement(this.locationToggle);
    await this.wait(500);
  }

  /**
   * Get location toggle status text
   */
  async getLocationToggleStatus(): Promise<string> {
    return await this.getText(this.toggleStatusText);
  }

  /**
   * Check if location is enabled
   */
  async isLocationEnabled(): Promise<boolean> {
    return await this.locationToggle.isChecked();
  }

  /**
   * Search by ZIP code
   */
  async searchByZipCode(zipCode: string) {
    await this.fillInput(this.zipCodeInput, zipCode);
    await this.clickElement(this.searchZipButton);
    await this.wait(1000);
  }

  /**
   * Get location status message
   */
  async getLocationStatusMessage(): Promise<string> {
    return await this.getText(this.locationStatus);
  }

  /**
   * Get reviews count
   */
  async getReviewsCount(): Promise<number> {
    return await this.reviewCards.count();
  }

  /**
   * Get all review data
   */
  async getAllReviews(): Promise<any[]> {
    const count = await this.getReviewsCount();
    const reviews: any[] = [];

    for (let i = 0; i < count; i++) {
      const card = this.reviewCards.nth(i);
      const reviewData = {
        restaurant: await card.locator('.restaurant-name, h3').textContent(),
        foodItem: await card.locator('.food-item').textContent(),
        rating: await card.locator('.rating, .stars').textContent(),
        reviewText: await card.locator('.review-text, p').textContent(),
      };
      reviews.push(reviewData);
    }

    return reviews;
  }

  /**
   * Check if reviews list is empty
   */
  async isReviewsListEmpty(): Promise<boolean> {
    const count = await this.getReviewsCount();
    return count === 0;
  }

  /**
   * Wait for reviews to load
   */
  async waitForReviewsToLoad(timeout: number = 5000) {
    try {
      await this.reviewCards.first().waitFor({ state: 'visible', timeout });
    } catch {
      // Reviews list might be empty
    }
  }

  /**
   * Check if specific review exists
   */
  async reviewExists(restaurantName: string, foodItem: string): Promise<boolean> {
    const reviews = await this.getAllReviews();
    return reviews.some(
      review =>
        review.restaurant?.includes(restaurantName) &&
        review.foodItem?.includes(foodItem)
    );
  }

  /**
   * Get validation errors
   */
  async getFormValidationErrors(): Promise<string[]> {
    const errors: string[] = [];

    // Check HTML5 validation
    const restaurantInvalid = await this.restaurantNameInput.evaluate((el: any) =>
      !el.validity.valid ? el.validationMessage : null
    );
    const foodInvalid = await this.foodItemInput.evaluate((el: any) =>
      !el.validity.valid ? el.validationMessage : null
    );
    const reviewInvalid = await this.reviewTextarea.evaluate((el: any) =>
      !el.validity.valid ? el.validationMessage : null
    );

    if (restaurantInvalid) errors.push(restaurantInvalid);
    if (foodInvalid) errors.push(foodInvalid);
    if (reviewInvalid) errors.push(reviewInvalid);

    return errors;
  }

  /**
   * Handle geolocation permission
   */
  async grantGeolocationPermission() {
    await this.page.context().grantPermissions(['geolocation']);
  }

  /**
   * Set geolocation coordinates
   */
  async setGeolocation(latitude: number, longitude: number) {
    await this.page.context().setGeolocation({ latitude, longitude });
  }
}
