# 🧪 Fresh Reviews - Automation Testing Suite

[![Playwright Tests](https://github.com/divyabairavarasu/fresh_reviews_automation/actions/workflows/playwright-tests.yml/badge.svg)](https://github.com/divyabairavarasu/fresh_reviews_automation/actions)
[![JIRA](https://img.shields.io/badge/JIRA-TEST--789-blue)](https://your-company.atlassian.net/browse/TEST-789)

Comprehensive end-to-end automation testing suite for the Fresh Reviews application using Playwright and TypeScript.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [CI/CD Integration](#cicd-integration)
- [Contributing](#contributing)

## 🎯 Overview

This repository contains automated tests for the Fresh Reviews application reviews page (`http://localhost:8080/reviews.html`). The test suite covers all acceptance criteria from JIRA ticket **TEST-789**.

### Test Coverage

- ✅ **46 Acceptance Criteria** covered
- ✅ **Authentication & Navigation** tests
- ✅ **Review Form Submission** validation
- ✅ **Rating System** functionality
- ✅ **Location Features** (geolocation & ZIP code)
- ✅ **Reviews Display** verification
- ✅ **Edge Cases & Security** (XSS, SQL injection prevention)
- ✅ **Responsive Design** (mobile, tablet, desktop)
- ✅ **Accessibility** (WCAG compliance)
- ✅ **Performance** benchmarks

## ✨ Features

- 🎭 **Page Object Model** (POM) design pattern
- 🧩 **TypeScript** for type safety
- 🔄 **Cross-browser testing** (Chrome, Firefox, Safari)
- 📱 **Mobile & tablet testing**
- 📸 **Screenshots on failure**
- 🎥 **Video recording** for failed tests
- 📊 **HTML & JUnit reports**
- 🔒 **Security testing** (XSS, SQL injection)
- ♿ **Accessibility testing**
- ⚡ **Performance monitoring**
- 🔗 **JIRA integration**
- 🤖 **CI/CD ready** (GitHub Actions)

## 📁 Project Structure

```
fresh_reviews_automation/
├── .github/
│   └── workflows/
│       └── playwright-tests.yml    # CI/CD pipeline
├── tests/
│   ├── pages/                      # Page Object Models
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   └── ReviewsPage.ts
│   ├── specs/                      # Test specifications
│   │   └── reviews.spec.ts         # Main test suite
│   ├── fixtures/                   # Test data
│   │   └── testData.ts
│   └── utils/                      # Helper utilities
│       └── helpers.ts
├── reports/                        # Test reports (generated)
├── screenshots/                    # Test screenshots
│   ├── baseline/
│   ├── actual/
│   └── diff/
├── playwright.config.ts            # Playwright configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Dependencies
├── .env.example                    # Environment variables template
└── README.md                       # This file
```

## 🔧 Prerequisites

- **Node.js** 18 or higher
- **npm** 9 or higher
- **Fresh Reviews application** running on `http://localhost:8080`

## 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/divyabairavarasu/fresh_reviews_automation.git
cd fresh_reviews_automation
```

2. **Install dependencies**

```bash
npm install
```

3. **Install Playwright browsers**

```bash
npm run install:browsers
```

4. **Configure environment variables**

```bash
cp .env.example .env
# Edit .env with your settings
```

## 🚀 Running Tests

### Run all tests

```bash
npm test
```

### Run tests in headed mode (see browser)

```bash
npm run test:headed
```

### Run tests with UI mode

```bash
npm run test:ui
```

### Run specific browser

```bash
npm run test:chrome
npm run test:firefox
npm run test:safari
```

### Run specific test suite

```bash
# Smoke tests only
npm run test:smoke

# Regression tests
npm run test:regression

# Reviews page tests
npm run test:reviews
```

### Run mobile tests

```bash
npm run test:mobile
```

### Debug tests

```bash
npm run test:debug
```

### View test report

```bash
npm run report
```

## 📊 Test Coverage

### Authentication & Navigation (4 tests)
- ✅ AC1: User must be logged in
- ✅ AC2: User name displayed
- ✅ AC3: Logout functionality
- ✅ AC4: Unauthorized access redirect

### Review Form Submission (5 tests)
- ✅ AC5: Required field validation
- ✅ AC6: Success message display
- ✅ AC7: Review appears in list
- ✅ AC8: Form reset after submission
- ✅ AC9: Error message for invalid data

### Rating System (4 tests)
- ✅ AC10: All 5 ratings selectable
- ✅ AC11: Rating required
- ✅ AC12: Visual rating highlight
- ✅ AC13: Single rating selection

### Location Features (7 tests)
- ✅ AC14: Location toggle functionality
- ✅ AC15: Toggle status text updates
- ✅ AC16: Geolocation permission
- ✅ AC17: Location-based filtering
- ✅ AC18: ZIP code search
- ✅ AC19: Invalid ZIP error handling
- ✅ AC20: ZIP-based filtering

### Reviews Display (5 tests)
- ✅ AC21: Reviews display correctly
- ✅ AC22: Empty state handling
- ✅ AC23: All review fields shown
- ✅ AC24: Date sorting (newest first)
- ✅ AC25: Real-time updates

### Edge Cases & Security (9 tests)
- ✅ AC26: XSS prevention
- ✅ AC27: SQL injection prevention
- ✅ AC28: Long text handling
- ✅ AC29: Special characters support
- ✅ AC30: Double-click prevention
- ✅ AC31: Back button behavior
- ✅ AC32: Session persistence
- ✅ AC33: Multiple submissions
- ✅ AC34: Emoji support

### Responsive Design (3 tests)
- ✅ AC35: Mobile rendering (375px)
- ✅ AC36: Tablet rendering (768px)
- ✅ AC37: Desktop rendering (1920px)

### Accessibility (5 tests)
- ✅ AC38: Proper form labels
- ✅ AC39: Keyboard navigation
- ✅ AC40: ARIA attributes
- ✅ AC41: Focus indicators
- ✅ AC42: Color contrast

### Performance (4 tests)
- ✅ AC43: Page load < 3 seconds
- ✅ AC44: Form submission < 2 seconds
- ✅ AC45: No console errors
- ✅ AC46: No memory leaks

## 🔄 CI/CD Integration

This project includes a GitHub Actions workflow that:

1. Runs tests on every push and pull request
2. Tests across multiple browsers (Chrome, Firefox, Safari)
3. Runs daily scheduled tests at 2 AM UTC
4. Uploads test reports and screenshots
5. Updates JIRA ticket with results
6. Sends Slack notifications

### Setting up CI/CD

Add these secrets to your GitHub repository:

```
TEST_USER_EMAIL=alice@example.com
TEST_USER_PASSWORD=password123
JIRA_URL=https://your-company.atlassian.net
JIRA_API_TOKEN=your_jira_token
JIRA_EMAIL=your_email@company.com
SLACK_WEBHOOK=your_slack_webhook_url
```

## 🐛 Troubleshooting

### Application not running

Ensure the Fresh Reviews application is running:

```bash
cd ../fresh_reviews
python3 -m http.server 8080
```

### Tests failing due to timing issues

Increase timeouts in `playwright.config.ts`:

```typescript
timeout: 60 * 1000, // 60 seconds
```

### Browser installation issues

Reinstall browsers:

```bash
npx playwright install --with-deps
```

## 📝 Test Data

Test credentials are configured in `.env`:

```
TEST_USER_EMAIL=alice@example.com
TEST_USER_PASSWORD=password123
TEST_USER_NAME=Alice Johnson
```

## 🤝 Contributing

1. Create a feature branch
2. Write tests following existing patterns
3. Ensure all tests pass
4. Update documentation
5. Submit pull request

## 📖 Documentation

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [JIRA Ticket TEST-789](https://your-company.atlassian.net/browse/TEST-789)

## 📧 Contact

- **QA Team**: qa@company.com
- **JIRA**: [TEST-789](https://your-company.atlassian.net/browse/TEST-789)

## 📄 License

MIT License - see LICENSE file for details

---

🤖 **Automated testing powered by Playwright and TypeScript**

**JIRA**: TEST-789 | **Status**: ✅ Complete
