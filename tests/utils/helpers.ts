import { Page } from '@playwright/test';

/**
 * Test Helper Utilities
 * Common helper functions for test execution
 * JIRA: TEST-789
 */

/**
 * Generate random string
 */
export function generateRandomString(length: number = 10): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Generate random email
 */
export function generateRandomEmail(): string {
  return `test${generateRandomString(8)}@example.com`;
}

/**
 * Generate random restaurant name
 */
export function generateRestaurantName(): string {
  const prefixes = ['The', 'La', 'El', 'Le'];
  const types = ['Restaurant', 'Cafe', 'Bistro', 'Kitchen', 'Grill', 'House'];
  const adjectives = ['Golden', 'Silver', 'Royal', 'Grand', 'Fresh', 'Urban'];

  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const type = types[Math.floor(Math.random() * types.length)];

  return `${prefix} ${adjective} ${type}`;
}

/**
 * Generate random food item
 */
export function generateFoodItem(): string {
  const items = [
    'Pizza', 'Burger', 'Pasta', 'Salad', 'Steak', 'Sushi',
    'Tacos', 'Ramen', 'Sandwich', 'Soup', 'Rice Bowl', 'Curry'
  ];
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Generate random rating
 */
export function generateRandomRating(): number {
  return Math.floor(Math.random() * 5) + 1;
}

/**
 * Generate random review text
 */
export function generateReviewText(length: 'short' | 'medium' | 'long' = 'medium'): string {
  const templates = {
    short: [
      'Great food!',
      'Loved it!',
      'Highly recommended!',
      'Amazing experience!',
      'Will come back!'
    ],
    medium: [
      'The food was absolutely delicious and the service was excellent.',
      'A wonderful dining experience with great atmosphere and friendly staff.',
      'Fresh ingredients and perfectly cooked. Highly recommend this place!',
      'Best meal I\'ve had in a long time. The flavors were amazing.'
    ],
    long: [
      'I had the most incredible dining experience here. The ambiance was perfect, the staff was attentive and knowledgeable, and the food exceeded all expectations. Every dish was crafted with care and the flavors were extraordinary. I would definitely return and recommend this to anyone looking for quality dining.',
      'This restaurant truly stands out among the rest. From the moment we walked in, we were greeted warmly and seated promptly. The menu offered a great variety of options, and our server was helpful in making recommendations. The food arrived quickly and was presented beautifully. Each bite was a delight, and the portions were generous. We left completely satisfied and already planning our next visit.'
    ]
  };

  const options = templates[length];
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Wait for element to be stable (no animations)
 */
export async function waitForStableElement(page: Page, selector: string, timeout: number = 5000) {
  await page.waitForSelector(selector, { state: 'visible', timeout });
  await page.waitForTimeout(500); // Wait for any animations to complete
}

/**
 * Retry function with custom retry logic
 */
export async function retryAsync<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Retry failed');
}

/**
 * Get current timestamp
 */
export function getTimestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

/**
 * Format date for display
 */
export function formatDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Sleep/wait for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if string contains XSS patterns
 */
export function containsXSSPatterns(text: string): boolean {
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /javascript:/gi,
    /onerror=/gi,
    /onload=/gi,
    /onclick=/gi
  ];

  return xssPatterns.some(pattern => pattern.test(text));
}

/**
 * Sanitize string for display
 */
export function sanitizeString(text: string): string {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Generate test report metadata
 */
export function generateTestMetadata() {
  return {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'test',
    baseURL: process.env.BASE_URL || 'http://localhost:8080',
    jiraTicket: process.env.JIRA_TICKET || 'TEST-789',
    browser: process.env.BROWSER || 'chromium'
  };
}

/**
 * Log test step
 */
export function logStep(step: string, data?: any) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${step}`);
  if (data) {
    console.log('Data:', JSON.stringify(data, null, 2));
  }
}

/**
 * Create unique test ID
 */
export function createTestId(): string {
  return `test_${Date.now()}_${generateRandomString(6)}`;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate ZIP code format (US)
 */
export function isValidUSZipCode(zipCode: string): boolean {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
