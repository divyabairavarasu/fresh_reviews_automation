import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Index Page Object Model
 * Handles index/home page interactions and navigation
 * JIRA: SCRUM-2
 */
export class IndexPage extends BasePage {
  // Locators
  readonly pageTitle: Locator;
  readonly mainContent: Locator;
  readonly loginLink: Locator;
  readonly signupLink: Locator;
  readonly navigationBar: Locator;
  readonly heroSection: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.pageTitle = page.locator('h1, h2').first();
    this.mainContent = page.locator('main, #main, .main-content, body');
    this.loginLink = page.locator('a[href*="index.html"], a:has-text("Login"), a:has-text("Sign In")');
    this.signupLink = page.locator('a[href*="signup.html"], a:has-text("Sign up"), a:has-text("Register")');
    this.navigationBar = page.locator('nav, .navbar, header');
    this.heroSection = page.locator('.hero, .banner, section').first();
  }

  /**
   * Navigate to index page
   */
  async navigate() {
    await this.goto('/index.html');
    await this.waitForPageLoad();
  }

  /**
   * Check if on index page
   */
  async isOnIndexPage(): Promise<boolean> {
    const url = this.getCurrentURL();
    return url.includes('index.html') || url.endsWith('/');
  }

  /**
   * Click login link
   */
  async clickLogin() {
    await this.clickElement(this.loginLink);
    await this.waitForNavigation();
  }

  /**
   * Click signup link
   */
  async clickSignup() {
    await this.clickElement(this.signupLink);
    await this.waitForNavigation();
  }

  /**
   * Get page title text
   */
  async getPageTitleText(): Promise<string> {
    if (await this.isVisible(this.pageTitle)) {
      return await this.getText(this.pageTitle);
    }
    return '';
  }

  /**
   * Check if navigation bar is visible
   */
  async isNavigationBarVisible(): Promise<boolean> {
    return await this.isVisible(this.navigationBar);
  }

  /**
   * Check if main content is visible
   */
  async isMainContentVisible(): Promise<boolean> {
    return await this.isVisible(this.mainContent);
  }

  /**
   * Check if login link is visible
   */
  async isLoginLinkVisible(): Promise<boolean> {
    return await this.isVisible(this.loginLink);
  }

  /**
   * Check if signup link is visible
   */
  async isSignupLinkVisible(): Promise<boolean> {
    return await this.isVisible(this.signupLink);
  }
}
