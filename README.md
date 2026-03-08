# HDFC Xpress BizFinance — Playwright E2E Automation Suite

> End-to-end automation for the **HDFC CLO (Xpress BizFinance)** web portal covering the complete **RM (Relationship Manager) loan proposal journey** — from login through final submission — using [Playwright](https://playwright.dev) and JavaScript.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Running the Tests](#running-the-tests)
- [Test Architecture](#test-architecture)
- [Journey Modules](#journey-modules)
- [Page Objects](#page-objects)
- [Data-Driven Testing](#data-driven-testing)
- [CI/CD Pipeline](#cicd-pipeline)
- [Adding a New Test](#adding-a-new-test)
- [Adding a New Environment](#adding-a-new-environment)
- [Troubleshooting](#troubleshooting)
- [Test Reports](#test-reports)

---

## Project Overview

This suite automates the **BBG (Business Banking Group) loan proposal workflow** on the HDFC Xpress BizFinance portal. The portal is an Angular application used by Relationship Managers (RMs) to originate, fill, and submit business loan applications.

| Item | Detail |
|---|---|
| **Portal** | HDFC Xpress BizFinance (CLO Portal) |
| **Business Group** | Working Capital |
| **Business Segment** | BBG (Business Banking Group) |
| **Automation Framework** | Playwright v1.58+ |
| **Language** | JavaScript ESM (ES Modules) |
| **Browser** | Chromium (default) |
| **Pattern** | Page Object Model (POM) + Data-Driven Testing (DDT) |
| **Environments** | UAT · SIT |
| **CI/CD** | GitHub Actions |

### What the suite tests

The automation covers **18 sequential journey modules** that make up a complete loan application, plus dedicated login, OTP, and dashboard tests:

```
Login → OTP → Dashboard → Create Lead → Customer Profile → Udyam
→ Add Product → Demographics → History → Applicant Details
→ Second Applicant → PSL → Documentation → Financials
→ Takeover → GST → ITR/P&L → Bank Statements → Security → Submit
```

---

## Technology Stack

| Tool | Version | Purpose |
|---|---|---|
| [Node.js](https://nodejs.org) | 20+ (LTS) | Runtime (required for `--env-file` flag) |
| [@playwright/test](https://playwright.dev) | ^1.58.2 | Test framework + browser automation |
| [Chromium](https://www.chromium.org) | bundled | Default test browser |
| [dotenv](https://github.com/motdotla/dotenv) | ^17.x | Environment variable loading |
| GitHub Actions | — | CI/CD pipeline |

---

## Project Structure

```
MVP1/
│
├── README.md                          ← You are here
├── package.json                       ← npm scripts and dependencies
├── playwright.config.js               ← Playwright configuration (env-aware)
│
├── .env.uat                           ← UAT environment variables
├── .env.sit                           ← SIT environment variables
│
├── .github/
│   └── workflows/
│       └── playwright.yml             ← CI/CD: 3-stage pipeline (login → modules → journey)
│
├── scripts/
│   ├── run_all.sh                     ← Linux/macOS runner script
│   ├── run_all.bat                    ← Windows runner script
│   ├── extract_excel_deep.py          ← Utility: extract journey data from Excel docs
│   └── read_excel.py                  ← Utility: read/parse Excel sheets
│
├── docs/
│   ├── e2e-tests.md                   ← E2E test case documentation
│   ├── RM Journey BBG.xlsx            ← Source: RM workflow screenshots & instructions
│   ├── RM_Journey_BBG_analysis.md     ← Parsed analysis of the Excel workflow doc
│   └── RM_Journey_BBG_parsed.md       ← Raw parsed text from Excel
│
└── tests/
    ├── config/
    │   └── testConfig.js              ← Central config — reads all env vars
    │
    ├── data/
    │   └── journeyData.json           ← Test datasets for DDT journey tests
    │
    ├── fixtures/
    │   └── README.md                  ← Instructions for required upload files
    │
    ├── pages/                         ← Page Object Models (POM)
    │   ├── LoginPage.js               ← Login form interactions
    │   ├── OtpPage.js                 ← OTP entry + submit + resend
    │   ├── DashboardPage.js           ← My Queue, ARN search, consent tab
    │   └── JourneyPage.js             ← All 18 journey module methods
    │
    ├── utils/
    │   ├── apiAnalyzer.js             ← Captures and reports API calls per module
    │   └── helpers.js                 ← Shared helpers: retryClick, uploadFile, etc.
    │
    ├── modules/                       ← Isolated spec per journey module
    │   ├── dashboard.spec.js          ← D-01 to D-04: My Queue & ARN search
    │   ├── createLead.spec.js         ← M-01 to M-04: Lead creation & consent
    │   ├── customerProfile.spec.js    ← M-02 to M-03: PAN entry & API fetch
    │   ├── udyam.spec.js              ← M-04: Udyam registration / skip
    │   ├── product.spec.js            ← M-05: Add facilities
    │   ├── demographics.spec.js       ← M-06: Demographics & address
    │   ├── applicant.spec.js          ← M-07, M-08, M-09: History & applicants
    │   ├── psl.spec.js                ← M-10: Priority Sector Lending
    │   ├── financials.spec.js         ← M-12, M-13: Financial info & takeover
    │   ├── gst.spec.js                ← M-14, M-15: GST & ITR/P&L
    │   ├── bankStatement.spec.js      ← M-16, M-17: Bank statements & security
    │   └── sourcing.spec.js           ← M-18: Sourcing details & final submit
    │
    ├── login.spec.js                  ← Login (L-01–L-07), OTP (O-01–O-06), E2E (E-01–E-04)
    └── journey.spec.js                ← Full sequential journey (Modules 1–18, DDT)
```

---

## Prerequisites

Before running the suite, ensure you have the following installed:

### 1. Node.js (v20 or later — **required**)

The `--env-file` flag used by all npm scripts requires **Node.js 20+**. Verify with:

```bash
node --version   # must be v20.x.x or higher
npm --version
```

Download: https://nodejs.org/en/download

### 2. Git

```bash
git --version
```

### 3. Network access to the portal

The machine running the tests must be able to reach the portal URLs:

| Env | URL |
|---|---|
| UAT | `https://smeclouat.hdfcbank.com` |
| SIT | `https://smeclosit.hdfcbank.com` |

> These are internal HDFC network URLs. A VPN or corporate network connection may be required.

---

## Installation & Setup

### Step 1 — Clone the repository

```bash
git clone <your-repo-url>
cd MVP1
```

### Step 2 — Install npm dependencies

```bash
npm install
```

### Step 3 — Install Playwright browsers

```bash
npx playwright install chromium
```

> To install all browsers (Chrome, Firefox, Safari):
> ```bash
> npx playwright install
> ```

### Step 4 — Verify the installation

```bash
npx playwright --version
# Expected: Version 1.58.x or higher
```

### Step 5 — Add fixture files *(for upload tests)*

Upload-dependent tests (Module 11, 12, 13, 14, 15) require sample files in `tests/fixtures/`. Copy any small PNG or PDF into the folder with these exact names:

```
tests/fixtures/
├── consent_form.png
├── personal_doc.png
├── balance_sheet.pdf
├── itr_doc.pdf
├── gst_doc.png
├── takeover_doc.png
├── financial_doc.png
└── psl_doc.jpg
```

> **Note:** If fixture files are missing, upload steps skip gracefully with a console warning — they will not fail the test run.

---

## Environment Configuration

All test parameters are driven by `.env` files. **No code changes are needed** to switch environments.

### Available environments

| File | Environment | Portal URL |
|---|---|---|
| `.env.uat` | UAT (default) | `https://smeclouat.hdfcbank.com` |
| `.env.sit` | SIT | `https://smeclosit.hdfcbank.com` |

### Environment variables reference

| Variable | Default (UAT) | Description |
|---|---|---|
| `ENV` | `UAT` | Environment label (used in logs and reports) |
| `BASE_URL` | `https://smeclouat.hdfcbank.com` | Portal base URL |
| `USER_ID` | `A10773` | Primary RM login ID |
| `PASSWORD` | `laser123` | Login password (same for all users in SIT/UAT) |
| `OTP` | `123456` | Fixed OTP for test environments |
| `BUSINESS_GROUP` | `Working Capital` | Business Group dropdown value |
| `BUSINESS_SEGMENT` | `BBG` | Business Segment dropdown value |
| `USER_ID_1` | `A10773` | Parameterised user 1 (E2E login tests) |
| `USER_ID_2` | `A15183` | Parameterised user 2 |
| `USER_ID_3` | `A23429` | Parameterised user 3 |
| `HEADLESS` | `false` | Set `true` to run without a visible browser window |

### Switching environments

```bash
# Run against UAT (default)
npm run test:uat

# Run against SIT
npm run test:sit

# Override a single variable at runtime
node --env-file .env.uat node_modules/.bin/playwright test --env USER_ID=A23429
```

### Adding a new environment

1. Copy `.env.uat` to the new file, e.g. `.env.prod`
2. Update `BASE_URL` and any credentials
3. Run: `node --env-file .env.prod node_modules/.bin/playwright test`

No code changes required.

---

## Running the Tests

### Quick start

```bash
# Run the full suite on UAT (headed browser)
npm test
```

### All run commands

| Command | What it runs |
|---|---|
| `npm test` | All tests on UAT (headed) |
| `npm run test:uat` | All tests on UAT |
| `npm run test:sit` | All tests on SIT |
| `npm run test:headless` | All tests on UAT, headless |
| `npm run test:login` | Login + OTP spec only |
| `npm run test:modules` | All module specs (`tests/modules/`) |
| `npm run test:journey` | Full journey spec (`tests/journey.spec.js`) |
| `npm run test:ci` | All tests with HTML + GitHub reporter |
| `npm run report` | Open the last HTML report in browser |

### Run a specific module

```bash
npm run test:module:dash        # Dashboard / My Queue tests
npm run test:module:lead        # Create Lead & Consent tests
npm run test:module:profile     # Customer Profile / PAN tests
npm run test:module:product     # Add Product / Facility tests
npm run test:module:financials  # Financial Info & Takeover tests
npm run test:module:sourcing    # Sourcing & Final Submit tests
```

### Run tests matching a keyword

```bash
# Run tests whose name contains "OTP"
npm test -- --grep "OTP"

# Run tests whose name contains "Module 5"
npm test -- --grep "Module 5"

# Run a specific test file
npm test -- tests/modules/product.spec.js
```

### Runner scripts (multi-suite)

```bash
# Linux / macOS
chmod +x scripts/run_all.sh
./scripts/run_all.sh              # all suites on UAT
./scripts/run_all.sh sit          # all suites on SIT
./scripts/run_all.sh uat login    # login tests only
./scripts/run_all.sh uat modules  # module tests only
./scripts/run_all.sh uat journey  # journey tests only

# Windows
scripts\run_all.bat               # all suites on UAT
scripts\run_all.bat sit           # all suites on SIT
scripts\run_all.bat uat modules   # module tests only
```

---

## Test Architecture

### Pattern: Page Object Model (POM)

All UI interactions are encapsulated in page objects under `tests/pages/`. Tests never contain raw `page.locator()` calls — they call named methods on page objects.

```
Test Spec  →  Page Object Method  →  Playwright locator
```

**Example:**
```javascript
// In a spec file — clean, readable
await loginPage.login(credentials);
await otpPage.enterAndSubmitOtp('123456');
await dashPage.waitForDashboard();

// Implementation detail lives in LoginPage.js — not in the test
```

### Pattern: Data-Driven Testing (DDT)

`tests/journey.spec.js` loops over `tests/data/journeyData.json`. Each JSON object becomes a complete test suite with its own browser context.

```javascript
for (const data of journeyData) {
    test.describe.serial(`RM Journey - [DATA: ${data.testName}]`, () => {
        // 18 module tests run in sequence using `data`
    });
}
```

Adding a new journey scenario = adding one object to `journeyData.json`. No code changes needed.

### Pattern: Serial module tests

All journey tests use `test.describe.serial()` to ensure modules run in order and share browser state (authenticated session).

```javascript
test.describe.serial('Module 5: Add Product', () => {
    test.beforeAll(async ({ browser }) => {
        // Navigate through prerequisites once
    });
    test('M-05a: ...', async () => { ... });
    test('M-05b: ...', async () => { ... });
});
```

### API Tracking

`tests/utils/apiAnalyzer.js` intercepts all XHR/fetch calls during the journey and generates a per-module markdown report saved to `test-results/api-analysis-<dataset>.md`. This is useful for understanding which APIs each module calls.

---

## Journey Modules

The full journey consists of 18 sequential modules, each with a corresponding method on `JourneyPage.js` and an isolated spec file in `tests/modules/`:

| # | Module | Method | Spec File |
|---|---|---|---|
| 1 | Login and OTP | `loginAndOTP()` | `login.spec.js` |
| 2 | Create Lead and Consent | `createLeadAndConsent()` | `modules/createLead.spec.js` |
| 3 | Select Customer Profile | `selectCustomer()` | `modules/customerProfile.spec.js` |
| 4 | Udyam Registration | `addUdyamRegistration()` | `modules/udyam.spec.js` |
| 5 | Add Product / Facility | `addProduct()` | `modules/product.spec.js` |
| 6 | Demographics and Address | `addDemographicsAndAddress()` | `modules/demographics.spec.js` |
| 7 | History and Business | `addHistoryAndBusiness()` | `modules/applicant.spec.js` |
| 8 | Update Primary Applicant | `updateApplicantDetails()` | `modules/applicant.spec.js` |
| 9 | Add Second Applicant | `addSecondApplicant()` | `modules/applicant.spec.js` |
| 10 | Priority Sector Lending | `addPSL()` | `modules/psl.spec.js` |
| 11 | Upload Documentation | `uploadDocumentation()` | *(journey.spec.js)* |
| 12 | Financial Info | `addFinancialInfo()` | `modules/financials.spec.js` |
| 13 | Take Over Details | `addTakeOver()` | `modules/financials.spec.js` |
| 14 | GST Details | `addGST()` | `modules/gst.spec.js` |
| 15 | ITR and P&L | `addITRAndPL()` | `modules/gst.spec.js` |
| 16 | Bank Statements | `addBankStatements()` | `modules/bankStatement.spec.js` |
| 17 | Security Details | `addSecurity()` | `modules/bankStatement.spec.js` |
| 18 | Sourcing and Submit | `addSourcingAndSubmit()` | `modules/sourcing.spec.js` |

---

## Page Objects

### `LoginPage.js`

| Method | Description |
|---|---|
| `goto(url)` | Navigate to the login URL |
| `fillUserId(id)` | Fill the RM ID field |
| `fillPassword(pwd)` | Fill the Password field |
| `selectBusinessGroup(group)` | Select from Business Group PrimeNG dropdown |
| `selectBusinessSegment(seg)` | Select from Business Segment PrimeNG dropdown |
| `clickLogin()` | Click the Log In button |
| `login(creds)` | Convenience: fill all fields + click login |

### `OtpPage.js`

| Method | Description |
|---|---|
| `waitForOtpPage()` | Wait for OTP inputs to be visible (15s timeout) |
| `enterOtp(otp)` | Type each digit into the 6 individual OTP boxes |
| `fillOtp(otp)` | Alias for `enterOtp()` |
| `submitOtp()` | Click the Submit OTP button |
| `enterAndSubmitOtp(otp)` | Wait → enter → submit in one call |
| `clickResendOtp(timeout)` | Wait for the resend link to become active and click it |

### `DashboardPage.js`

| Method | Description |
|---|---|
| `waitForDashboard()` | Wait for My Queue heading (20s timeout) |
| `clickConsentTab()` | Switch to the Consent tab |
| `clickPendingTab()` | Switch to the Pending tab |
| `clickSubmittedTab()` | Switch to the Submitted tab |
| `searchARN(arn)` | Fill ARN search and press Enter |
| `selectConsentByMobile(mobile)` | Click consent row matching a mobile number |
| `clickCreateNew()` | Click the Create New button |
| `verifyQueueTabs()` | Returns `{pending, submitted, consent}` visibility booleans |

### `JourneyPage.js`

One method per journey module (18 total). Each method accepts the relevant `data` object from `journeyData.json`. See [Journey Modules](#journey-modules) for the full list.

---

## Data-Driven Testing

Test data lives in `tests/data/journeyData.json`. Each object in the array represents a complete loan scenario.

### Current datasets

| Dataset | Sector | Key Features |
|---|---|---|
| High Value BBG - Manufacturing | Manufacturing | 2 facilities (CC + TL), Entity guarantor, 2 takeovers |
| High Value BBG - Service Sector | IT Services | Single takeover, No OD, ICICI bank statement |

### Dataset structure

```json
{
  "testName": "High Value BBG - Manufacturing",
  "mobileNumber": "8990909090",
  "businessSegment": "BBG",
  "customerGridId": "205981",
  "panNumber": "AHMPA1234A",
  "companyName": "Ganesh solutions",
  "companyPincode": "400033",
  "sector": "Service",
  "facility1": { "type": "Cash Credit", "purpose": "...", "amount": "10,00,0000" },
  "facility2": { "type": "Term Loan",   "purpose": "...", "amount": "2,00,0000", "tenure": "60" },
  "demographics": { "email": "...", "industry": "...", "subIndustry": "...", "dateOfIncorporation": "..." },
  "address": { "line1": "...", "line2": "...", "pincode": "...", "occupancy": "Leased" },
  "applicant": { "firstName": "...", "maritalStatus": "...", "religion": "...", "caste": "..." },
  "psl": { "category": "...", "subCategory": "..." },
  "financials": { "securedLoan": "...", "caNumber": "...", "caName": "...", "udinNo": "..." },
  "gst": { "monthlySales": [ "20,0000", ... ] },
  "bankStatement": { "bankName": "HDFC Bank", "accountNumber": "...", "existingOD": "Yes" },
  "takeOver": { "type": "...", "ifscCode": "...", "loanAmount": "..." },
  "security": { "type": "...", "collateralValue": "...", "address": { ... } },
  "udyam": { "number": "UDYAM-MH-33-0012345", "skip": true },
  "itrAndPL": { "uploadBalanceSheet": true, "uploadITR": true, "confirmCheckbox": true },
  "sourcing": { "branch": "14 - JALANDHAR", "branchSearch": "jalandhar", "ccpa": "..." },
  "docs": {
    "consentForm": "tests/fixtures/consent_form.png",
    "personalDocument": "tests/fixtures/personal_doc.png"
  }
}
```

### Adding a new scenario

1. Open `tests/data/journeyData.json`
2. Copy an existing object and add it to the array
3. Update the `testName` and any fields that differ
4. Run `npm run test:journey` — your new scenario is automatically picked up

---

## CI/CD Pipeline

The GitHub Actions pipeline (`.github/workflows/playwright.yml`) runs **3 jobs in sequence**:

```
login-tests  →  module-tests  →  journey-tests
```

| Job | Tests | Timeout | Condition |
|---|---|---|---|
| `login-tests` | `tests/login.spec.js` | 15 min | Always runs |
| `module-tests` | `tests/modules/` | 30 min | Runs if login-tests pass |
| `journey-tests` | `tests/journey.spec.js` | 60 min | Runs if module-tests pass |

### Triggers

- Push to `main` or `master`
- Pull request to `main` or `master`
- Manual trigger via GitHub Actions UI (`workflow_dispatch`) — with env and suite selection

### Artifacts uploaded

- **HTML report** — always uploaded, retained 30 days
- **Test results + traces** — uploaded on failure, retained 7–14 days

### Required GitHub Secrets

Add these in **Settings → Secrets → Actions** for your repository:

| Secret | Description |
|---|---|
| `UAT_BASE_URL` | UAT portal URL (optional, defaults to smeclouat) |
| `SIT_BASE_URL` | SIT portal URL (optional, defaults to smeclosit) |
| `USER_ID` | Primary RM login ID |
| `USER_ID_1` | Parameterised user 1 |
| `USER_ID_2` | Parameterised user 2 |
| `USER_ID_3` | Parameterised user 3 |
| `PASSWORD` | Login password |
| `OTP` | Test OTP value |
| `BUSINESS_GROUP` | Business Group dropdown value |
| `BUSINESS_SEGMENT` | Business Segment dropdown value |

> If secrets are not set, the pipeline falls back to the defaults in `.env.uat`.

---

## Adding a New Test

### Option A — Add to an existing module spec

Open the relevant file in `tests/modules/` and add a new `test()` block:

```javascript
test('M-05f: Amount field shows error for zero value', async () => {
    await sharedPage.locator('#loanAmount').nth(1).fill('0');
    await sharedPage.locator('#loanAmount').nth(1).press('Tab');
    const error = sharedPage.locator('.error-message').first();
    await expect(error).toBeVisible();
});
```

### Option B — Create a new module spec

1. Copy `tests/modules/dashboard.spec.js` as a template
2. Update the `describe` label, `beforeAll` navigation, and add your tests
3. Add an npm script to `package.json` if needed:

```json
"test:module:mymodule": "node --env-file .env.uat node_modules/.bin/playwright test tests/modules/myModule.spec.js"
```

### Option C — Add a new JourneyPage method

1. Add the method to `tests/pages/JourneyPage.js`
2. Add a call to it in `tests/journey.spec.js` as a new module test
3. Add the relevant data keys to `tests/data/journeyData.json`

---

## Adding a New Environment

1. Copy `.env.uat`:
   ```bash
   cp .env.uat .env.prod
   ```

2. Edit `.env.prod` — update `BASE_URL`, credentials as needed:
   ```ini
   ENV=PROD
   BASE_URL=https://smecloprod.hdfcbank.com
   USER_ID=A99999
   PASSWORD=yourpassword
   ```

3. Run against the new environment:
   ```bash
   node --env-file .env.prod node_modules/.bin/playwright test
   ```

4. Optionally add an npm script to `package.json`:
   ```json
   "test:prod": "node --env-file .env.prod node_modules/.bin/playwright test"
   ```

---

## Troubleshooting

### `node: --env-file flag is not supported`

**Cause:** Node.js version is below v20.  
**Fix:** Upgrade Node.js to v20 LTS or later.

```bash
node --version   # must be v20+
```

---

### `Error: browserType.launch: Executable doesn't exist`

**Cause:** Playwright browsers not installed.  
**Fix:**
```bash
npx playwright install chromium
```

---

### `Timeout: Locator not found` on login page

**Cause:** The portal URL is unreachable (VPN/network issue) or the Angular app is loading slowly.  
**Fix:**
1. Open `BASE_URL` in a browser and confirm it loads
2. Check VPN connection
3. Increase timeout in `playwright.config.js`:
   ```javascript
   timeout: 90_000  // increase from 60_000
   ```

---

### `Expected 6 OTP boxes, found 0`

**Cause:** Login credentials are incorrect so the OTP page never appears.  
**Fix:**
1. Verify `USER_ID`, `PASSWORD`, `BUSINESS_GROUP`, `BUSINESS_SEGMENT` in your `.env` file
2. Manually log in to the portal to confirm credentials work

---

### `TypeError: this.enterOtp is not a function`

**Cause:** Stale `OtpPage.js` without the `enterOtp()` alias.  
**Fix:** Pull latest code — this bug was fixed in the last update.

---

### `dashboardUrl` contains spaces / URL is malformed

**Cause:** Old version of `testConfig.js`.  
**Fix:** Pull latest code — this bug was fixed. The URL is now: `${baseUrl}/clouat/cloportal/#/rm-journey-queue`

---

### Upload steps fail in CI

**Cause:** Fixture files are missing from `tests/fixtures/`.  
**Fix:** Add small placeholder files or commit real test documents:
```bash
# Create minimal placeholder PNGs for CI
cp any-image.png tests/fixtures/consent_form.png
cp any-image.png tests/fixtures/personal_doc.png
```

---

### Tests are flaky / intermittently failing

**Tips:**
- Increase `actionTimeout` in `playwright.config.js` (currently `15_000` ms)
- Use `retryClick()` from `tests/utils/helpers.js` for unstable elements
- Add `await page.waitForLoadState('networkidle')` before interacting with slow API responses
- Run with traces on to debug: `trace: 'on'` in `playwright.config.js` (default is `on`)

---

## Test Reports

### HTML Report (local)

After any test run:
```bash
npm run report
# Opens playwright-report/index.html in your browser
```

### Trace Viewer

Traces are captured automatically. To open a trace:
```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

### API Analysis Reports

After running `tests/journey.spec.js`, a markdown report is generated per dataset:
```
test-results/api-analysis-high_value_bbg___manufacturing.md
test-results/api-analysis-high_value_bbg___service_sector.md
```

These list every API call made during each module — useful for backend integration verification.

---

## Test Case Summary

| Suite | Cases | File |
|---|---|---|
| Login Page | L-01 to L-07 (7 tests) | `tests/login.spec.js` |
| OTP Page | O-01 to O-06 (6 tests) | `tests/login.spec.js` |
| Full Login E2E | E-01 to E-04 (4 tests) | `tests/login.spec.js` |
| Dashboard | D-01 to D-04 (4 tests) | `tests/modules/dashboard.spec.js` |
| Create Lead | M-01 to M-04 (4 tests) | `tests/modules/createLead.spec.js` |
| Customer Profile | M-02 to M-03c (4 tests) | `tests/modules/customerProfile.spec.js` |
| Udyam | M-04a to M-04c (3 tests) | `tests/modules/udyam.spec.js` |
| Add Product | M-05a to M-05e (5 tests) | `tests/modules/product.spec.js` |
| Demographics | M-06a to M-06g (7 tests) | `tests/modules/demographics.spec.js` |
| Applicants | M-07 to M-09c (7 tests) | `tests/modules/applicant.spec.js` |
| PSL | M-10a to M-10e (5 tests) | `tests/modules/psl.spec.js` |
| Financials + Takeover | M-12a to M-13e (9 tests) | `tests/modules/financials.spec.js` |
| GST + ITR | M-14a to M-15c (6 tests) | `tests/modules/gst.spec.js` |
| Bank Statements + Security | M-16a to M-17d (10 tests) | `tests/modules/bankStatement.spec.js` |
| Sourcing + Submit | M-18a to M-18f (6 tests) | `tests/modules/sourcing.spec.js` |
| **Full Journey DDT** | **18 module tests × datasets** | `tests/journey.spec.js` |
| **Total (unit + module)** | **~97 test cases** | — |

---

*Last updated: March 2026 — HDFC Xpress BizFinance E2E Automation Suite*
