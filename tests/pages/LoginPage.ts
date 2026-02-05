import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Login Page Object Model
 * Handles login page interactions and authentication
 * JIRA: TEST-789
 */
export class LoginPage extends BasePage {
  // Locators
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly signupLink: Locator;
  readonly errorMessage: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.emailInput = page.locator('#email, input[name="email"], input[type="email"]');
    this.passwordInput = page.locator('#password, input[name="password"], input[type="password"]');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    this.signupLink = page.locator('a:has-text("Sign up"), a:has-text("Register")');
    this.errorMessage = page.locator('.error-message, .alert-error, #error, [role="alert"]');
    this.pageTitle = page.locator('h1, h2').first();
  }

  /**
   * Navigate to login page
   */
  async navigate() {
    await this.goto('/index.html');
    await this.waitForPageLoad();
  }

  /**
   * Perform login with credentials
   */
  async login(email: string, password: string) {
    await this.fillInput(this.emailInput, email);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement(this.loginButton);
    await this.waitForNavigation();
  }

  /**
   * Quick login with default test user
   */
  async loginWithTestUser() {
    const email = process.env.TEST_USER_EMAIL || 'alice@example.com';
    const password = process.env.TEST_USER_PASSWORD || 'password123';
    await this.login(email, password);
  }

  /**
   * Check if login was successful
   */
  async isLoginSuccessful(): Promise<boolean> {
    // Check if redirected to reviews page or dashboard
    const url = this.getCurrentURL();
    return url.includes('reviews.html') || url.includes('search.html');
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    if (await this.isVisible(this.errorMessage)) {
      return await this.getText(this.errorMessage);
    }
    return '';
  }

  /**
   * Check if on login page
   */
  async isOnLoginPage(): Promise<boolean> {
    const url = this.getCurrentURL();
    return url.includes('index.html') || url.endsWith('/');
  }

  /**
   * Click signup link
   */
  async clickSignup() {
    await this.clickElement(this.signupLink);
    await this.waitForNavigation();
  }

  /**
   * Setup authenticated session via local storage
   * Useful for tests that don't need to go through login UI
   */
  async setupAuthSession(userData?: any) {
    const defaultUser = {
      email: process.env.TEST_USER_EMAIL || 'alice@example.com',
      name: process.env.TEST_USER_NAME || 'Alice Johnson',
      loggedIn: 'true'
    };

    const user = userData || defaultUser;

    await this.goto('/');
    await this.setLocalStorageItem('currentUser', JSON.stringify(user));
    await this.setLocalStorageItem('isLoggedIn', 'true');
  }

  /**
   * Clear auth session
   */
  async clearAuthSession() {
    await this.clearLocalStorage();
  }
}
