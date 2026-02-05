/**
 * Test Data Fixtures
 * Contains test data for various test scenarios
 * JIRA: TEST-789
 */

export const TestUsers = {
  valid: {
    email: process.env.TEST_USER_EMAIL || 'alice@example.com',
    password: process.env.TEST_USER_PASSWORD || 'password123',
    name: process.env.TEST_USER_NAME || 'Alice Johnson'
  },
  secondUser: {
    email: process.env.TEST_USER_2_EMAIL || 'bob@example.com',
    password: process.env.TEST_USER_2_PASSWORD || 'password123',
    name: process.env.TEST_USER_2_NAME || 'Bob Smith'
  },
  invalid: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
    name: 'Invalid User'
  }
};

export const TestReviews = {
  valid: {
    restaurantName: 'Test Restaurant',
    foodItem: 'Test Dish',
    rating: 5,
    reviewText: 'Amazing food! Highly recommended.'
  },
  shortReview: {
    restaurantName: 'Cafe',
    foodItem: 'Coffee',
    rating: 4,
    reviewText: 'Good.'
  },
  longReview: {
    restaurantName: 'Fine Dining Restaurant with Very Long Name',
    foodItem: 'Exquisite Gourmet Dish with Multiple Ingredients',
    rating: 5,
    reviewText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(20)
  },
  specialCharacters: {
    restaurantName: "Joe's Pizza & Pasta <script>alert('test')</script>",
    foodItem: 'Margherita "Special" Pizza',
    rating: 4,
    reviewText: 'Great taste! ⭐️🍕🎉 <img src=x onerror=alert(1)>'
  },
  emojis: {
    restaurantName: '🍔 Burger Place 🍟',
    foodItem: '🌮 Taco Supreme 🌶️',
    rating: 5,
    reviewText: 'Absolutely delicious! 😋🔥💯'
  },
  maxLength: {
    restaurantName: 'A'.repeat(200),
    foodItem: 'B'.repeat(200),
    rating: 3,
    reviewText: 'C'.repeat(1000)
  }
};

export const TestZipCodes = {
  valid: process.env.TEST_ZIP_CODE || '94102',
  invalid: process.env.INVALID_ZIP_CODE || '99999',
  empty: '',
  specialChars: '!@#$%',
  tooShort: '941',
  tooLong: '941024567',
  letters: 'ABCDE'
};

export const TestLocations = {
  sanFrancisco: {
    latitude: 37.7749,
    longitude: -122.4194,
    zipCode: '94102'
  },
  newYork: {
    latitude: 40.7128,
    longitude: -74.0060,
    zipCode: '10001'
  },
  losAngeles: {
    latitude: 34.0522,
    longitude: -118.2437,
    zipCode: '90001'
  }
};

export const TestRatings = {
  excellent: 5,
  good: 4,
  average: 3,
  poor: 2,
  terrible: 1,
  invalid: {
    tooHigh: 6,
    tooLow: 0,
    negative: -1,
    decimal: 3.5
  }
};

export const ValidationMessages = {
  required: 'This field is required',
  invalidEmail: 'Please enter a valid email',
  invalidZipCode: 'Please enter a valid ZIP code',
  ratingRequired: 'Please select a rating'
};

export const Timeouts = {
  short: 2000,
  medium: 5000,
  long: 10000,
  extraLong: 30000
};

export const URLPaths = {
  login: '/index.html',
  signup: '/signup.html',
  reviews: '/reviews.html',
  search: '/search.html'
};
