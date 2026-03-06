# E2E Test Documentation — HDFC Xpress BizFinance Portal

## Overview

End-to-end Playwright tests for the **HDFC Xpress BizFinance (CLO)** portal covering the **Login** and **OTP verification** flows.

| Item | Detail |
|---|---|
| Framework | [Playwright](https://playwright.dev) |
| Language | JavaScript (ESM) |
| Browser | Chromium (default) |
| Default Env | UAT |

---

## Project Structure

```
MVP1/
├── playwright.config.js          ← Playwright configuration (env-aware)
├── .env.uat                      ← UAT environment variables
├── .env.sit                      ← SIT environment variables
└── tests/
    ├── config/
    │   └── testConfig.js         ← Central config (reads from env vars)
    ├── pages/
    │   ├── LoginPage.js          ← Page Object: Login form
    │   └── OtpPage.js            ← Page Object: OTP entry
    └── login.spec.js             ← All Login + OTP test cases
```

---

## Environment Configuration

All test parameters are driven by environment variables. Switch environments by pointing to the right `.env` file — **no code changes needed**.

### Available `.env` Files

| File | Environment | Base URL |
|---|---|---|
| `.env.uat` | UAT (default) | `https://smeclouat.hdfcbank.com` |
| `.env.sit` | SIT | `https://smeclosit.hdfcbank.com` |

### Variables Reference

| Variable | Default | Description |
|---|---|---|
| `ENV` | `UAT` | Environment label (for logging) |
| `BASE_URL` | `https://smeclouat.hdfcbank.com` | Portal base URL |
| `USER_ID` | `A10773` | Primary login user ID |
| `PASSWORD` | `laser123` | Login password |
| `OTP` | `123456` | OTP code |
| `BUSINESS_GROUP` | `Working Capital` | Business Group dropdown value |
| `BUSINESS_SEGMENT` | `BBG` | Business Segment dropdown value |
| `USER_ID_1/2/3` | `A10773 / A15183 / A23429` | User IDs for parameterised E2E tests |
| `HEADLESS` | `false` | Set `true` to run headless |
| `ENV_FILE` | `.env.uat` | Which `.env` file to load |

---

## Running the Tests

### Prerequisites

```bash
npm install
npx playwright install chromium
```

### Run Commands

| Scenario | Command |
|---|---|
| Run all tests (UAT, headed) | `npm test` or `npm run test:uat` |
| Run on SIT | `npm run test:sit` |
| Run login tests only | `npm run test:login` |
| Run headless | `npm run test:headless` |
| Run a specific test group | `npm test -- --grep "OTP Page"` |
| Run only E2E tests | `npm test -- --grep "Full Login Flow"` |
| Override user at runtime | `node --env-file .env.uat node_modules/.bin/playwright test --env USER_ID=A23429` |
| Override base URL inline | `cross-env BASE_URL=https://my-new-url.com npm test` |
| View HTML report | `npm run report` |

---

## Test Cases

### 1. Login Page (`tests/login.spec.js` → `describe('Login Page')`)

| # | Test Name | Description |
|---|---|---|
| L-01 | should display the login page correctly | Verifies page title, RM ID, Password, Business Group dropdowns and Login button are all visible |
| L-02 | should allow typing in RM ID field | Types a user ID and asserts field value |
| L-03 | should allow typing in Password field | Types a password and asserts field value |
| L-04 | should reveal Business Segment dropdown after selecting Business Group | Ensures the dependent segment dropdown appears after group is chosen |
| L-05 | should prevent login with empty credentials | Asserts Login button is disabled or page stays on login URL |
| L-06 | should show error for invalid credentials | Submits with bad credentials; asserts page stays on `#/rm-journey` |
| L-07 | should navigate to OTP page after valid login | Full credential entry → OTP inputs are visible |

### 2. OTP Page (`describe('OTP Page')`)

| # | Test Name | Description |
|---|---|---|
| O-01 | should display 6 OTP input boxes | Counts `.otp-input` elements — expects 6 |
| O-02 | should display Submit OTP button | Assert Submit OTP button is visible |
| O-03 | should accept digit input in each OTP box | Types configured OTP; validates first box value |
| O-04 | should redirect to dashboard after valid OTP | Valid OTP submitted → URL becomes `#/rm-journey-queue` |
| O-05 | should stay on OTP page for invalid OTP | OTP `000000` → OTP inputs remain visible (no redirect) |

### 3. Full Login Flow (`describe('Full Login Flow')`)

| # | Test Name | Description |
|---|---|---|
| E-01 | E2E — complete login and reach dashboard (primary user) | Full flow: navigate → fill form → OTP → dashboard → verify "My Queue" text |
| E-02 | E2E — full login for user A10773 | Parameterised test for user `USER_ID_1` |
| E-03 | E2E — full login for user A15183 | Parameterised test for user `USER_ID_2` |
| E-04 | E2E — full login for user A23429 | Parameterised test for user `USER_ID_3` |

**Total: 16 test cases**

---

## Page Objects

### `LoginPage.js`

Encapsulates all interactions with the login form.

| Method | Description |
|---|---|
| `goto(url)` | Navigates to the login URL (passed from `testConfig.loginUrl`) |
| `fillUserId(id)` | Fills the RM ID field |
| `fillPassword(pwd)` | Fills the Password field |
| `selectBusinessGroup(group)` | Opens and selects a value from the Business Group PrimeNG dropdown |
| `selectBusinessSegment(seg)` | Opens and selects a value from the Business Segment PrimeNG dropdown |
| `clickLogin()` | Clicks the "Log In" button |
| `login(creds)` | Convenience method — fills all fields and clicks Login |

### `OtpPage.js`

Encapsulates all interactions with the OTP verification screen.

| Method | Description |
|---|---|
| `waitForOtpPage()` | Waits for the first OTP input to be visible (15 s timeout) |
| `enterOtp(otp)` | Types each digit of a 6-character OTP string into individual boxes |
| `submitOtp()` | Clicks "Submit OTP" button |
| `enterAndSubmitOtp(otp)` | Convenience: wait → enter → submit |

---

## Selectors Reference

| Element | Selector |
|---|---|
| RM ID input | `#userId` |
| Password input | `#userPassword` |
| Business Group dropdown | `p-dropdown[formcontrolname="businessGroup"]` |
| Business Segment dropdown | `p-dropdown[formcontrolname="businessSegment"]` |
| Dropdown options | `.p-dropdown-panel .p-dropdown-item` |
| Login button | `button.primary-button` (text: "Log In") |
| OTP boxes (×6) | `.otp-input` → `.nth(0)` … `.nth(5)` |
| Submit OTP button | `button.primary-button` (text: "Submit OTP") |

---

## Adding a New Environment

1. Copy `.env.uat` to e.g. `.env.prod`
2. Update `BASE_URL` and any other values
3. Run: `cross-env ENV_FILE=.env.prod npx playwright test`

No code changes required.
