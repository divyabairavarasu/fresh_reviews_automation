import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Search Page Object Model
 * Handles search page interactions and functionality
 * JIRA: SCRUM-3
 */
export class SearchPage extends BasePage {
  // Locators
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchResults: Locator;
  readonly filterSection: Locator;
  readonly noResultsMessage: Locator;
  readonly mainContent: Locator;
  readonly navigationBar: Locator;
  readonly loadingIndicator: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.searchInput = page.locator('input[type="search"], input[name="search"], input[placeholder*="search" i], #search, .search-input');
    this.searchButton = page.locator('button[type="submit"], button:has-text("Search"), .search-button');
    this.searchResults = page.locator('.search-results, #search-results, .results, [data-testid="search-results"]');
    this.filterSection = page.locator('.filters, .filter-section, aside, .sidebar');
    this.noResultsMessage = page.locator('.no-results, .empty-state, :has-text("No results"), :has-text("not found")');
    this.mainContent = page.locator('main, #main, .main-content, body');
    this.navigationBar = page.locator('nav, .navbar, header');
    this.loadingIndicator = page.locator('.loading, .spinner, [aria-busy="true"]');
  }

  /**
   * Navigate to search page
   */
  async navigate() {
    await this.goto('/search.html');
    await this.waitForPageLoad();
  }

  /**
   * Check if on search page
   */
  async isOnSearchPage(): Promise<boolean> {
    const url = this.getCurrentURL();
    return url.includes('search.html');
  }

  /**
   * Perform search
   */
  async search(query: string) {
    if (await this.isVisible(this.searchInput)) {
      await this.fillInput(this.searchInput, query);
      if (await this.isVisible(this.searchButton)) {
        await this.clickElement(this.searchButton);
      } else {
        await this.searchInput.press('Enter');
      }
      await this.waitForPageLoad();
    }
  }

  /**
   * Check if search results are visible
   */
  async areSearchResultsVisible(): Promise<boolean> {
    return await this.isVisible(this.searchResults);
  }

  /**
   * Check if no results message is shown
   */
  async isNoResultsMessageVisible(): Promise<boolean> {
    return await this.isVisible(this.noResultsMessage);
  }

  /**
   * Check if filter section is visible
   */
  async isFilterSectionVisible(): Promise<boolean> {
    return await this.isVisible(this.filterSection);
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
   * Check if search input is visible
   */
  async isSearchInputVisible(): Promise<boolean> {
    return await this.isVisible(this.searchInput);
  }

  /**
   * Get search results count
   */
  async getSearchResultsCount(): Promise<number> {
    if (await this.areSearchResultsVisible()) {
      const results = await this.page.locator('.search-result, .result-item, [data-testid="result"]').all();
      return results.length;
    }
    return 0;
  }

  /**
   * Wait for search to complete
   */
  async waitForSearchComplete() {
    // Wait for loading indicator to disappear
    if (await this.isVisible(this.loadingIndicator)) {
      await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 10000 });
    }
    await this.waitForPageLoad();
  }
}
