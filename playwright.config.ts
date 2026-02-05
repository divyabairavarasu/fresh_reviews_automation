import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Playwright Configuration for Fresh Reviews Automation
 * JIRA Ticket: TEST-789
 *
 * This configuration supports:
 * - Multiple browsers (Chrome, Firefox, Safari)
 * - Mobile emulation
 * - Visual regression testing
 * - Accessibility testing
 * - Parallel execution
 * - HTML reports with screenshots and videos
 */

export default defineConfig({
  // Test directory
  testDir: './tests/specs',

  // Test timeout
  timeout: 30 * 1000, // 30 seconds per test

  // Expect timeout
  expect: {
    timeout: 10 * 1000, // 10 seconds for assertions
  },

  // Run tests in parallel
  fullyParallel: true,

  // Fail fast on CI
  forbidOnly: !!process.env.CI,

  // Retry failed tests
  retries: process.env.CI ? 2 : 0,

  // Number of parallel workers
  workers: process.env.CI ? 2 : undefined,

  // Reporter configuration
  reporter: [
    ['html', {
      outputFolder: 'reports/html-report',
      open: 'never'
    }],
    ['json', {
      outputFile: 'reports/test-results.json'
    }],
    ['junit', {
      outputFile: 'reports/junit-results.xml'
    }],
    ['list'],
    ['allure-playwright', {
      detail: true,
      outputFolder: 'reports/allure-results',
      suiteTitle: false
    }]
  ],

  // Global test configuration
  use: {
    // Base URL
    baseURL: process.env.BASE_URL || 'http://localhost:8080',

    // Browser options
    headless: process.env.HEADED !== 'true',

    // Trace recording
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video recording
    video: 'retain-on-failure',

    // Default viewport
    viewport: { width: 1280, height: 720 },

    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,

    // Action timeout
    actionTimeout: 10 * 1000,

    // Navigation timeout
    navigationTimeout: 30 * 1000,
  },

  // Projects for different browsers and devices
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--disable-web-security'],
        }
      },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile browsers
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },

    // Tablet
    {
      name: 'tablet',
      use: { ...devices['iPad Pro'] },
    },
  ],

  // Web server configuration (optional - for local testing)
  webServer: process.env.START_SERVER === 'true' ? {
    command: 'cd ../fresh_reviews && python3 -m http.server 8080',
    port: 8080,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  } : undefined,
});
