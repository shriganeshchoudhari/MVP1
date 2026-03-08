# E2E Test Cases — HDFC Xpress BizFinance Portal

> **Auto-synced from source** — every test ID, name, assertion, locator and pre-condition below
> is taken directly from the spec files. Update the spec files first; then refresh this document.

---

## Quick Reference

| # | Suite | File | Tests |
|---|---|---|---|
| 1 | Login Page | `tests/login.spec.js` | L-01 · L-02 · L-03 · L-04 · L-05 · L-06 · L-07 |
| 2 | OTP Page | `tests/login.spec.js` | O-01 · O-02 · O-03 · O-04 · O-05 · O-06 |
| 3 | Full Login Flow (E2E) | `tests/login.spec.js` | E-01 · E-02 · E-03 · E-04 |
| 4 | Dashboard — My Queue | `tests/modules/dashboard.spec.js` | D-01 · D-02 · D-03 · D-04 |
| 5 | Module 2: Create Lead and Consent | `tests/modules/createLead.spec.js` | M-01 · M-01b · M-01c · M-02 · M-03 · M-04 |
| 6 | Module 3: Customer Profile (PAN Entry) | `tests/modules/customerProfile.spec.js` | M-02 · M-03 · M-03b · M-03c |
| 7 | Module 4: Udyam Registration | `tests/modules/udyam.spec.js` | M-04a · M-04b · M-04c |
| 8 | Module 5: Add Product | `tests/modules/product.spec.js` | M-05a · M-05b · M-05c · M-05d · M-05e |
| 9 | Module 6: Demographics and Address | `tests/modules/demographics.spec.js` | M-06a · M-06b · M-06c · M-06d · M-06e · M-06f · M-06g |
| 10 | Module 7: History and Business | `tests/modules/applicant.spec.js` | M-07a · M-07b · M-07c |
| 11 | Module 8: Update Primary Applicant Details | `tests/modules/applicant.spec.js` | M-08a · M-08b · M-08c · M-08d |
| 12 | Module 9: Add Second Applicant | `tests/modules/applicant.spec.js` | M-09a · M-09b · M-09c |
| 13 | Module 10: Priority Sector Lending (PSL) | `tests/modules/psl.spec.js` | M-10a · M-10b · M-10c · M-10d · M-10e |
| 14 | Module 12: Financial Info | `tests/modules/financials.spec.js` | M-12a · M-12b · M-12c · M-12d |
| 15 | Module 13: Take Over Details | `tests/modules/financials.spec.js` | M-13a · M-13b · M-13c · M-13d · M-13e |
| 16 | Module 14: GST Details | `tests/modules/gst.spec.js` | M-14a · M-14b · M-14c |
| 17 | Module 15: ITR and P&L | `tests/modules/gst.spec.js` | M-15a · M-15b · M-15c |
| 18 | Module 16: Bank Statements | `tests/modules/bankStatement.spec.js` | M-16a · M-16b · M-16c · M-16d · M-16e · M-16f |
| 19 | Module 17: Security Details | `tests/modules/bankStatement.spec.js` | M-17a · M-17b · M-17c · M-17d |
| 20 | Module 18: Sourcing Details and Final Submit | `tests/modules/sourcing.spec.js` | M-18a · M-18b · M-18c · M-18d · M-18e · M-18f |
| 21 | Full E2E Journey (Data-Driven) | `tests/journey.spec.js` | 18 modules × 2 datasets = 36 journey tests |

**Total unit + module tests: 97**

---

## Suite 1 — Login Page

**File:** `tests/login.spec.js`
**Describe block:** `'Login Page'`
**beforeEach:** `loginPage.goto(loginUrl)` — navigates to UAT/SIT login URL before every test

| ID | Exact Test Name (as in code) | Locators & Assertions |
|---|---|---|
| L-01 | `should display the login page correctly` | `expect(page).toHaveTitle(/Xpress BizFinance\|HDFC/i)` · `loginPage.userIdInput` toBeVisible · `loginPage.passwordInput` toBeVisible · `loginPage.businessGroupDdl` toBeVisible · `loginPage.loginButton` toBeVisible |
| L-02 | `should allow typing in RM ID field` | `loginPage.fillUserId(credentials.userId)` → `loginPage.userIdInput` toHaveValue `credentials.userId` |
| L-03 | `should allow typing in Password field` | `loginPage.fillPassword(credentials.password)` → `loginPage.passwordInput` toHaveValue `credentials.password` |
| L-04 | `should reveal Business Segment dropdown after selecting Business Group` | fillUserId · fillPassword · selectBusinessGroup → `loginPage.businessSegDdl` toBeVisible |
| L-05 | `should prevent login with empty credentials` | if loginButton.isDisabled → toBeDisabled; else clickLogin → `expect(page).toHaveURL(loginUrl)` |
| L-06 | `should show error for invalid credentials` | fillUserId `'A00000'` · fillPassword `'wrongpassword'` · selectBusinessGroup · selectBusinessSegment · clickLogin · wait 2s → `expect(page.url()).toContain('#/rm-journey')` |
| L-07 | `should navigate to OTP page after valid login` | `loginPage.login(CREDS)` · `otpPage.waitForOtpPage()` → `otpPage.otpInputs.first()` toBeVisible |

---

## Suite 2 — OTP Page

**File:** `tests/login.spec.js`
**Describe block:** `'OTP Page'`
**beforeEach:** `loginPage.goto(loginUrl)` → `loginPage.login(CREDS)` → `otpPage.waitForOtpPage()`

| ID | Exact Test Name (as in code) | Locators & Assertions |
|---|---|---|
| O-01 | `should display 6 OTP input boxes` | `otpPage.otpInputs.count()` → `expect(count).toBe(6)` |
| O-02 | `should display Submit OTP button` | `otpPage.submitOtpBtn` toBeVisible |
| O-03 | `should accept digit input in each OTP box` | `otpPage.fillOtp(credentials.otp)` → `otpPage.otpInputs.nth(0)` toHaveValue `credentials.otp[0]` |
| O-04 | `should redirect to dashboard after valid OTP` | `otpPage.enterAndSubmitOtp(credentials.otp)` · waitForURL `'**rm-journey-queue**'` (15s) → `expect(page.url()).toContain('rm-journey-queue')` |
| O-05 | `should stay on OTP page for invalid OTP` | `otpPage.enterAndSubmitOtp('000000')` · wait 2s → `otpPage.otpInputs.first().isVisible()` toBe `true` |
| O-06 | `should show Resend OTP link on OTP page` | `otpPage.resendOtpLink` toBeVisible (timeout: 10 000 ms) |

---

## Suite 3 — Full Login Flow (E2E)

**File:** `tests/login.spec.js`
**Describe block:** `'Full Login Flow'`
**Note:** E-02 / E-03 / E-04 are dynamically generated by iterating `testConfig.users` array (`['A10773', 'A15183', 'A23429']`)

| ID | Exact Test Name (as in code) | Locators & Assertions |
|---|---|---|
| E-01 | `E2E — complete login and reach dashboard (primary user)` | goto loginUrl → login(CREDS) → waitForOtpPage → enterAndSubmitOtp → waitForURL `'**rm-journey-queue**'` (15s) → `expect(page).toHaveURL(/rm-journey-queue/)` · `page.locator('text=My Queue')` toBeVisible (10s) |
| E-02 | `E2E — full login for user A10773` | goto → login `{ ...CREDS, userId: 'A10773' }` → OTP → waitForURL → toHaveURL `/rm-journey-queue/` |
| E-03 | `E2E — full login for user A15183` | goto → login `{ ...CREDS, userId: 'A15183' }` → OTP → waitForURL → toHaveURL `/rm-journey-queue/` |
| E-04 | `E2E — full login for user A23429` | goto → login `{ ...CREDS, userId: 'A23429' }` → OTP → waitForURL → toHaveURL `/rm-journey-queue/` |

---

## Suite 4 — Dashboard — My Queue

**File:** `tests/modules/dashboard.spec.js`
**Describe block:** `'Dashboard — My Queue'`
**beforeAll:** Login (A10773) → OTP → shared page reused across all 4 tests

| ID | Exact Test Name (as in code) | Locators & Assertions |
|---|---|---|
| D-01 | `D-01: My Queue renders with 3 tabs (Pending / Submitted / Consent)` | `dash.waitForDashboard()` · `dash.verifyQueueTabs()` → `tabs.pending` toBe `true` · `tabs.submitted` toBe `true` · `tabs.consent` toBe `true` |
| D-02 | `D-02: ARN search input is visible and accepts text` | `dash.arnSearchInput` toBeVisible · `.fill('ARN123456')` → toHaveValue `'ARN123456'` |
| D-03 | `D-03: Consent tab is clickable and renders consent grid` | `dash.waitForDashboard()` · `dash.clickConsentTab()` → `dash.consentGrid` toBeVisible (10s) |
| D-04 | `D-04: Create New button is visible and navigates to lead creation` | `dash.createNewBtn` toBeVisible · `dash.clickCreateNew()` → `locator('#mobileNumber, input[placeholder*="Mobile"]').first()` toBeVisible (10s) |

---

## Suite 5 — Module 2: Create Lead and Consent

**File:** `tests/modules/createLead.spec.js`
**Describe block:** `'Module 2: Create Lead and Consent'` (`test.describe.serial`)
**beforeAll:** Login (A10773) → OTP → `dash.waitForDashboard()`

| ID | Exact Test Name (as in code) | Locators & Assertions |
|---|---|---|
| M-01 | `M-01: Create New opens mobile number entry form` | `dash.clickCreateNew()` → `locator('#mobileNumber, input[placeholder*="Mobile"]').first()` toBeVisible (10s) |
| M-01b | `M-01b: Invalid mobile number (too short) shows validation error` | `#mobileNumber`.fill(`'99999'`) · click `button` filtered by `/get customer consent/i` → `.error-message, .p-error, .mat-error, .ng-invalid` toBeVisible (5s) |
| M-01c | `M-01c: Mobile number field rejects non-numeric input` | `#mobileNumber`.fill(`'ABCDEFGHIJ'`) → `inputValue().replace(/\D/g, '')` toHaveLength `0` |
| M-02 | `M-02: Physical consent type selection is available` | `locator('mat-radio-button, input[type="radio"]').filter({ hasText: /physical/i }).first()` toBeVisible |
| M-03 | `M-03: Business Segment dropdown appears on Create Lead form` | `locator('text=Select BusinessSegment').first()` toBeVisible |
| M-04 | `M-04: Get Customer Consent button is present` | `locator('button').filter({ hasText: /get customer consent/i }).first()` toBeVisible |

---

## Suite 6 — Module 3: Customer Profile (PAN Entry)

**File:** `tests/modules/customerProfile.spec.js`
**Describe block:** `'Module 3: Customer Profile (PAN Entry)'` (`test.describe.serial`)
**beforeAll:** `jp.loginAndOTP(testConfig.credentials)` → `dash.waitForDashboard()` → `dash.clickConsentTab()`
**Test data:** `journeyData[0]` — mobile `8990909090`, PAN `AHMPA1234A`, pincode `400033`

| ID | Exact Test Name (as in code) | Locators & Assertions |
|---|---|---|
| M-02 | `M-02: Consent grid row is clickable — proceeds to PAN page` | `locator('tr:has-text("8990909090"), .p-datatable-row:has-text("8990909090")').first()` waitFor visible (15s) · click → `locator('input[placeholder*="PAN"], #panNumber').first()` toBeVisible (10s) |
| M-03 | `M-03: Valid PAN triggers API fetch and pre-fills company name` | fill `'AHMPA1234A'` · press Tab · wait 2s → `locator('#zebra, input[placeholder*="Company"]').first()` not.toBeEmpty |
| M-03b | `M-03b: Invalid PAN format shows validation error` | fill `'INVALID123'` · press Tab · wait 500ms → `.error-message, .p-error, .mat-error` toBeVisible (5s) |
| M-03c | `M-03c: Pincode field accepts numeric input` | `getByRole('spinbutton').first()`.fill(`'400033'`) → toHaveValue `'400033'` |

---

## Suite 7 — Module 4: Udyam Registration

**File:** `tests/modules/udyam.spec.js`
**Describe block:** `'Module 4: Udyam Registration'` (`test.describe.serial`)
**beforeAll:** `jp.loginAndOTP` → `jp.createLeadAndConsent(data)` → `jp.selectCustomer(data)`

| ID | Exact Test Name (as in code) | Locators & Assertions |
|---|---|---|
| M-04a | `M-04a: Udyam page renders with number input and Skip option` | `getByPlaceholder('Enter Udyam Number')` toBeVisible (10s) · `getByText('Skip this step')` toBeVisible |
| M-04b | `M-04b: Skip this step — advances to next module without Udyam` | click `'Skip this step'` → `getByRole('button', { name: /add product/i })` OR `.stepper-step.active` isVisible → `expect(visible).toBe(true)` |
| M-04c | `M-04c: Valid Udyam number format (UDYAM-XX-XX-XXXXXXX) is accepted` | if Udyam input visible → fill `'UDYAM-MH-33-0012345'` → toHaveValue `'UDYAM-MH-33-0012345'`; else `test.skip()` |

---

## Suite 8 — Module 5: Add Product

**File:** `tests/modules/product.spec.js`
**Describe block:** `'Module 5: Add Product'` (`test.describe.serial`)
**beforeAll:** loginAndOTP → createLeadAndConsent → selectCustomer → addUdyamRegistration
**Test data:** sector `'Service'`, facility1 `{ type: 'Cash Credit', purpose: 'TERM LOAN FOR CAPITAL', amount: '10,00,0000' }`, facility2 `{ type: 'Term Loan', purpose: 'TERM LOAN FOR WORKING CAPITAL', amount: '2,00,0000', tenure: '60' }`

| ID | Exact Test Name (as in code) | Locators & Assertions |
|---|---|---|
| M-05a | `M-05a: Sector dropdown is visible and selectable` | `getByText('Select Sector')` toBeVisible (10s) · click · `getByRole('option', { name: 'Service' })` toBeVisible · click |
| M-05b | `M-05b: Add Product button appears after sector selection` | `getByRole('button', { name: '+ Add Product' })` toBeVisible (5s) |
| M-05c | `M-05c: Facility type dropdown opens when Add Product clicked` | click `'+ Add Product'` → `locator('#facilityCode').getByText('Select Type')` toBeVisible (5s) |
| M-05d | `M-05d: Facility 1 (Cash Credit) can be configured and added` | select `#facilityCode` → `'Cash Credit'` · select `#loanPurpose` → `'TERM LOAN FOR CAPITAL'` · fill `#loanAmount` `'10,00,0000'` · select NORMAL · click Add → `locator('text=Cash Credit').first()` toBeVisible (5s) |
| M-05e | `M-05e: Two facilities can be added before proceeding` | click `'+ Add Product'` · configure Term Loan `2,00,0000` tenure `60` NORMAL · click Add → `locator('.facility-row, tr:has-text("Cash Credit"), tr:has-text("Term Loan")')` count `toBeGreaterThanOrEqual(2)` |

---

## Suite 9 — Module 6: Demographics and Address

**File:** `tests/modules/demographics.spec.js`
**Describe block:** `'Module 6: Demographics and Address'` (`test.describe.serial`)
**beforeAll:** loginAndOTP → createLeadAndConsent → selectCustomer → addUdyamRegistration → addProduct
**Test data:** email `'admin@ganeshsolutions.com'`, industry `'MANUFACTURING'`, subIndustry `'-RUBBER AND PLASTIC PRODUCTS'`, dateOfIncorporation `'02-02-2000'`, address lines 1–5, pincode `'400033'`, occupancy `'Leased'`

| ID | Exact Test Name (as in code) | Locators & Assertions |
|---|---|---|
| M-06a | `M-06a: Demographics section renders with email and industry fields` | `getByRole('textbox').nth(1)` toBeVisible (10s) · `getByText('Select Industry')` toBeVisible |
| M-06b | `M-06b: Email field accepts valid email address` | `getByRole('textbox').nth(1)`.fill(email) → toHaveValue `data.demographics.email` |
| M-06c | `M-06c: Industry dropdown populates with options` | click `'Select Industry'` → `getByRole('option').count()` toBeGreaterThan `0` · press Escape |
| M-06d | `M-06d: Date of Incorporation field accepts dd-mm-yyyy format` | `getByRole('textbox', { name: 'dd-mm-yyyy' }).first()`.fill(`'02-02-2000'`) · Tab → toHaveValue `'02-02-2000'` |
| M-06e | `M-06e: Add Permanent Address button is visible` | `getByRole('button', { name: '+ Add Permanent Address' })` toBeVisible (5s) |
| M-06f | `M-06f: Address form opens when Add Permanent Address clicked` | click `'+ Add Permanent Address'` · click `'+ Add New'` → `locator('#addressLine1').nth(1)` toBeVisible (5s) |
| M-06g | `M-06g: All address line fields can be filled` | fill `#addressLine1–5`.nth(1) · fill pincode spinbutton → `locator('#addressLine1').nth(1)` toHaveValue `addr.line1` |

---

## Suite 10 — Module 7: History and Business

**File:** `tests/modules/applicant.spec.js`
**Describe block:** `'Module 7: History and Business'` (`test.describe.serial`)
**beforeAll:** loginAndOTP → createLeadAndConsent → selectCustomer → addUdyamRegistration → addProduct → addDemographicsAndAddress
**Test data:** `history.description` = `"Ganesh Solutions is a manufacturing company established in 2000..."`

| ID | Exact Test Name (as in code) | Locators & Assertions |
|---|---|---|
| M-07a | `M-07a: Add History and Business button is visible` | `getByRole('button', { name: '+ Add History and Business' })` toBeVisible (10s) |
| M-07b | `M-07b: Textarea accepts business description` | click button · `locator('textarea').first()`.fill(description) → toHaveValue `data.history.description` |
| M-07c | `M-07c: History entry is saved and Continue advances the journey` | click Add · click Continue → `locator('text=Applicant, text=Update').first()` toBeVisible (10s) |

---

## Suite 11 — Module 8: Update Primary Applicant Details

**File:** `tests/modules/applicant.spec.js`
**Describe block:** `'Module 8: Update Primary Applicant Details'` (`test.describe.serial`)
**beforeAll:** `navigateToApplicantStep()` — loginAndOTP through addHistoryAndBusiness
**Test data:** firstName `'GANESH'`, middleName `'KUMAR'`, maritalStatus `'Married'`, spouseName `'PRIYA GANESH'`, fatherName `'RAMESH KUMAR'`, religion `'HINDU'`, caste `'OBC'`

| ID | Exact Test Name (as in code) | Locators & Assertions |
|---|---|---|
| M-08a | `M-08a: Applicant edit form opens correctly` | `locator('a').nth(5)`.click · click Update → `locator('#firstName').nth(1)` toBeVisible (10s) |
| M-08b | `M-08b: First and middle name fields accept input` | fill `#firstName`.nth(1) · fill `#middleName`.nth(1) → `#firstName`.nth(1) toHaveValue `data.applicant.firstName` |
| M-08c | `M-08c: Marital status dropdown has selectable options` | click `'Select Marital Status'` → `getByRole('option', { name: 'Married' })` toBeVisible · click |
| M-08d | `M-08d: Religion and Caste dropdowns work correctly` | click `'Select Religion'` → select `'HINDU'` · click `'Select Caste'` → select `'OBC'` (exact) → `locator('text=OBC').first()` toBeVisible |

---

## Suite 12 — Module 9: Add Second Applicant

**File:** `tests/modules/applicant.spec.js`
**Describe block:** `'Module 9: Add Second Applicant'` (`test.describe.serial`)
**beforeAll:** `navigateToApplicantStep()` — same as Module 8

| ID | Exact Test Name (as in code) | Locators & Assertions |
|---|---|---|
| M-09a | `M-09a: Add Applicant button is visible` | `getByRole('button', { name: '+ Add Applicant' })` toBeVisible (10s) |
| M-09b | `M-09b: Second applicant type selection renders Entity and Individual options` | click button → `getByLabel('Entity')` toBeVisible · `getByLabel('Individual')` toBeVisible |
| M-09c | `M-09c: Entity type shows additional fields (business name, industry)` | `getByLabel('Entity')`.click → `locator('#businessName').nth(1)` toBeVisible (5s) |

---

## Suite 13 — Module 10: Priority Sector Lending (PSL)

**File:** `tests/modules/psl.spec.js`
**Describe block:** `'Module 10: Priority Sector Lending (PSL)'` (`test.describe.serial`)
**beforeAll:** loginAndOTP → createLeadAndConsent → selectCustomer → addUdyamRegistration → addProduct → addDemographicsAndAddress → addHistoryAndBusiness
**Test data:** category `'PSL SMALL MANUFACTURING ENTERPRISES'`, subCategory `'MANUFACT ENTP- SMALL'`

| ID | Exact Test Name (as in code) | Locators & Assertions |
|---|---|---|
| M-10a | `M-10a: PSL section renders with Add PSL button` | `getByRole('button', { name: '+ Add PSL' })` toBeVisible (10s) |
| M-10b | `M-10b: PSL Category dropdown is populated` | click `'+ Add PSL'` · click `.mat-radio-outer-circle` · click `'Select PSL Category'` → `getByRole('option').count()` toBeGreaterThan `0` · select category |
| M-10c | `M-10c: PSL Sub-Category appears after Category selection` | `getByText('Select PSL Subcategory')` toBeVisible (5s) |
| M-10d | `M-10d: PSL Sub-Category can be selected` | click `'Select PSL Subcategory'` · click `data.psl.subCategory` → `locator('text=' + subCategory).first()` toBeVisible |
| M-10e | `M-10e: File upload input is accessible for PSL document` | `locator('input[type="file"]').first()` isVisible OR isHidden → toBeTruthy (asserts DOM presence) |

---

## Suite 14 — Module 12: Financial Info

**File:** `tests/modules/financials.spec.js`
**Describe block:** `'Module 12: Financial Info'` (`test.describe.serial`)
**beforeAll:** `navigateToFinancials()` — loginAndOTP through addPSL → uploadDocumentation
**Test data:** securedLoan `'3,00,0000'`, termLoan `'2,00,0000'`, totalProjectedSales `'25,00,0000'`, caNumber `'CA1234'`, caName `'Rajesh Sharma'`, udinNo `'UDIN98765'`

| ID | Exact Test Name (as in code) | Locators & Assertions |
|---|---|---|
| M-12a | `M-12a: Financial Info section is visible` | `getByRole('heading', { name: 'Financial Info' })` toBeVisible (10s) |
| M-12b | `M-12b: Secured Loan field accepts currency amount` | click heading · fill `locator('#securedLoan').nth(1)` → toHaveValue `data.financials.securedLoan` |
| M-12c | `M-12c: CA Number, CA Name and UDIN fields are fillable` | fill `#caNumber`.nth(1) · `#caName`.nth(1) · `#udinNo`.nth(1) → `#caNumber`.nth(1) toHaveValue `data.financials.caNumber` |
| M-12d | `M-12d: Projected Sales and Term Loan fields accept values` | fill `#termLoan`.nth(1) · `#totalProjectedSales`.nth(1) → `#termLoan`.nth(1) toHaveValue `data.financials.termLoan` |

---

## Suite 15 — Module 13: Take Over Details

**File:** `tests/modules/financials.spec.js`
**Describe block:** `'Module 13: Take Over Details'` (`test.describe.serial`)
**beforeAll:** `navigateToFinancials()` — same as Module 12
**Test data:** type `'Term Loan'`, ifscCode `'HDFC0000771'`, bankAccountNumber `'1234567890'`, loanAmount `'5,00,0000'`, email `'takeover@example.com'`

| ID | Exact Test Name (as in code) | Locators & Assertions |
|---|---|---|
| M-13a | `M-13a: Takeover section heading is visible` | `getByRole('heading', { name: 'Take Over' })` toBeVisible (10s) · click |
| M-13b | `M-13b: Add Takeover button opens takeover form` | click `'+ Add Takeover'` → `getByText('Select Type').first()` toBeVisible (5s) |
| M-13c | `M-13c: Type dropdown has selectable options` | click `'Select Type'` → `getByRole('option').count()` toBeGreaterThan `0` · select `data.takeOver.type` |
| M-13d | `M-13d: IFSC code field validates on Tab` | fill `locator('#ifscCode').getByRole('textbox')` · press Tab → toHaveValue `data.takeOver.ifscCode` |
| M-13e | `M-13e: Bank account number and loan amount fields accept values` | fill `#bankAccountNumber`.nth(1) · `#loanAmount`.nth(1) → `#bankAccountNumber`.nth(1) toHaveValue `data.takeOver.bankAccountNumber` |

---

## Suite 16 — Module 14: GST Details

**File:** `tests/modules/gst.spec.js`
**Describe block:** `'Module 14: GST Details'` (`test.describe.serial`)
**beforeAll:** `navigateToGST()` — loginAndOTP through addTakeOver
**Test data:** `gst.monthlySales` = 12 monthly values (e.g. `['20,0000', '22,0000', ...]`)

| ID | Exact Test Name (as in code) | Locators & Assertions |
|---|---|---|
| M-14a | `M-14a: GST section heading is visible` | `getByRole('heading', { name: 'GST' })` toBeVisible (10s) · click |
| M-14b | `M-14b: Add Monthly Sales button opens 12-month input grid` | click `'+ Add Monthly Sales'` → `locator('#month0')` toBeVisible (5s) |
| M-14c | `M-14c: All 12 monthly GST sale fields accept values` | loop fill `#month0` – `#month11` → `#month0` toHaveValue `gst[0]` · `#month11` toHaveValue `gst[11]` |

---

## Suite 17 — Module 15: ITR and P&L

**File:** `tests/modules/gst.spec.js`
**Describe block:** `'Module 15: ITR and P&L'` (`test.describe.serial`)
**beforeAll:** `navigateToGST()` — same as Module 14

| ID | Exact Test Name (as in code) | Locators & Assertions |
|---|---|---|
| M-15a | `M-15a: ITR & P&L section heading is visible` | `getByRole('heading', { name: 'ITR & P&L' })` toBeVisible (10s) · click |
| M-15b | `M-15b: Upload manually option is available` | `getByText('Upload manually')` toBeVisible (5s) |
| M-15c | `M-15c: Confirm checkbox exists for document upload acknowledgement` | if `'Upload manually'` visible → click · `getByText(/confirm.*process.*uploaded/i).first()` toBeVisible (5s) |

---

## Suite 18 — Module 16: Bank Statements

**File:** `tests/modules/bankStatement.spec.js`
**Describe block:** `'Module 16: Bank Statements'` (`test.describe.serial`)
**beforeAll:** `navigateToBankStatements()` — loginAndOTP through addITRAndPL
**Test data:** bankName `'HDFC Bank'`, accountNumber `'1234567890'`, existingOD `'Yes'`, limit `'500000'`

| ID | Exact Test Name (as in code) | Locators & Assertions |
|---|---|---|
| M-16a | `M-16a: Bank Statements section heading is visible` | `getByRole('heading', { name: 'Bank Statements' })` toBeVisible (10s) · click |
| M-16b | `M-16b: Select Bank dropdown is available` | click `'manual upload'` button (catch if missing) → `getByText('Select Bank')` toBeVisible (5s) |
| M-16c | `M-16c: Bank dropdown populates with selectable bank names` | click `'Select Bank'` → `getByRole('option').count()` toBeGreaterThan `0` · select `data.bankStatement.bankName` |
| M-16d | `M-16d: Account number field accepts numeric input` | `getByPlaceholder('Account Number')`.fill(`'1234567890'`) → toHaveValue `'1234567890'` |
| M-16e | `M-16e: Existing OD Yes/No toggle works` | if OD = `'Yes'` → click Yes → `getByPlaceholder('Limit')` toBeVisible (3s); else click No → Limit toBeVisible toBe `false` |
| M-16f | `M-16f: Perfios terms and conditions checkbox is present` | `getByText(/terms and conditions for perfios/i).first()` toBeVisible (5s) |

---

## Suite 19 — Module 17: Security Details

**File:** `tests/modules/bankStatement.spec.js`
**Describe block:** `'Module 17: Security Details'` (`test.describe.serial`)
**beforeAll:** `navigateToBankStatements()` — same as Module 16
**Test data:** type `'Residential Property'`, year `'2010'`, collateralValue `'30,00,0000'`, otherValue `'500000'`

| ID | Exact Test Name (as in code) | Locators & Assertions |
|---|---|---|
| M-17a | `M-17a: Security section heading is visible` | `getByRole('heading', { name: 'Security' })` toBeVisible (10s) · click |
| M-17b | `M-17b: Add Security button opens security form` | click `'+ Add Security'` → `getByText('Please select').first()` toBeVisible (5s) |
| M-17c | `M-17c: Security type dropdown has selectable options` | click `'Please select'` → `getByRole('option').count()` toBeGreaterThan `0` · select `data.security.type` |
| M-17d | `M-17d: Collateral value field accepts currency amount` | fill `locator('#collateralMarketValue').nth(1)` → toHaveValue `data.security.collateralValue` |

---

## Suite 20 — Module 18: Sourcing Details and Final Submit

**File:** `tests/modules/sourcing.spec.js`
**Describe block:** `'Module 18: Sourcing Details and Final Submit'` (`test.describe.serial`)
**beforeAll:** loginAndOTP → all 17 modules → `jp.addSecurity(data)`
**Test data:** branch `'14 - JALANDHAR'`, branchSearch `'jalandhar'`, ccpa `'EURE2348 - Yashraj Lavaniyna'`, ccpaSearch `'EURE2348'`

| ID | Exact Test Name (as in code) | Locators & Assertions |
|---|---|---|
| M-18a | `M-18a: Actions menu is accessible` | `locator('a').filter({ hasText: 'Actions' }).first()` toBeVisible (10s) |
| M-18b | `M-18b: Sourcing Details option appears in Actions menu` | click Actions → `locator('div').filter({ hasText: 'Sourcing Details' }).nth(5)` toBeVisible (5s) |
| M-18c | `M-18c: Branch dropdown is searchable and selectable` | click Sourcing Details · click `'Select Branch'` · fill `.p-dropdown-filter` `'jalandhar'` → `getByRole('option', { name: '14 - JALANDHAR' })` toBeVisible (5s) · click |
| M-18d | `M-18d: CCPA Code dropdown is searchable and selectable` | click `'Select CCPA Code'` · fill filter `'EURE2348'` → `getByRole('option', { name: 'EURE2348 - Yashraj Lavaniyna' })` toBeVisible (5s) · click |
| M-18e | `M-18e: Submit button is enabled after branch and CCPA selection` | `getByRole('button', { name: 'Submit' })` toBeEnabled (5s) |
| M-18f | `M-18f: Clicking Submit completes the journey (success dialog appears)` | click Submit → `getByRole('img', { name: 'close icon' })` OR `locator('text=/success\|submitted\|application/i')` isVisible (15s) → confirmed toBe `true` |

---

## Suite 21 — Full E2E Journey (Data-Driven)

**File:** `tests/journey.spec.js`
**Pattern:** `for (const data of journeyData)` — creates one `test.describe.serial` per dataset
**Describe block name:** `` `RM Journey - [DATA: ${data.testName}]` ``
**beforeAll:** opens browser page, creates `JourneyPage` and `APIAnalyzer` instances, starts API response interceptor
**afterAll:** writes API analysis markdown to `test-results/api-analysis-<safeName>.md`, closes page

### Datasets

| Dataset | testName | Sector | Key Details |
|---|---|---|---|
| 1 | `High Value BBG - Manufacturing` | Manufacturing | 2 facilities (CC + TL), HDFC bank, entity guarantor, 2 takeovers |
| 2 | `High Value BBG - Service Sector` | IT Services | Single takeover, No OD, ICICI bank, PRIVATE LIMITED COMPANY |

### Tests (same 18 run for each dataset)

| # | Exact Test Name (as in code) | JourneyPage Method Called |
|---|---|---|
| 1 | `Module 1: Login and OTP` | `journeyPage.loginAndOTP(testConfig.credentials)` |
| 2 | `Module 2: Create Lead and Consent` | `journeyPage.createLeadAndConsent(data)` |
| 3 | `Module 3: Select Customer Profile` | `journeyPage.selectCustomer(data)` |
| 4 | `Module 4: Udyam Registration` | `journeyPage.addUdyamRegistration(data)` |
| 5 | `Module 5: Add Product` | `journeyPage.addProduct(data)` |
| 6 | `Module 6: Add Demographics and Address` | `journeyPage.addDemographicsAndAddress(data)` |
| 7 | `Module 7: Add History and Business` | `journeyPage.addHistoryAndBusiness(data)` |
| 8 | `Module 8: Update Primary Applicant Details` | `journeyPage.updateApplicantDetails(data)` |
| 9 | `Module 9: Add Second Applicant` | `journeyPage.addSecondApplicant(data)` |
| 10 | `Module 10: Add Priority Sector Lending (PSL)` | `journeyPage.addPSL(data)` |
| 11 | `Module 11: Upload Documentation` | `journeyPage.uploadDocumentation(data.docs \|\| {})` |
| 12 | `Module 12: Add Financial Info` | `journeyPage.addFinancialInfo(data)` |
| 13 | `Module 13: Add Take Over Details` | `journeyPage.addTakeOver(data)` |
| 14 | `Module 14: Add GST Details` | `journeyPage.addGST(data)` |
| 15 | `Module 15: Add ITR & P&L` | `journeyPage.addITRAndPL(data)` |
| 16 | `Module 16: Add Bank Statements` | `journeyPage.addBankStatements(data)` |
| 17 | `Module 17: Add Security Details` | `journeyPage.addSecurity(data)` |
| 18 | `Module 18: Add Sourcing Details and Submit` | `journeyPage.addSourcingAndSubmit(data)` |

---

## Test Count Summary

| Suite | Describe Block Name | Spec File | Count |
|---|---|---|---|
| Login Page | `Login Page` | `login.spec.js` | 7 |
| OTP Page | `OTP Page` | `login.spec.js` | 6 |
| Full Login Flow | `Full Login Flow` | `login.spec.js` | 4 |
| Dashboard | `Dashboard — My Queue` | `modules/dashboard.spec.js` | 4 |
| Create Lead | `Module 2: Create Lead and Consent` | `modules/createLead.spec.js` | 6 |
| Customer Profile | `Module 3: Customer Profile (PAN Entry)` | `modules/customerProfile.spec.js` | 4 |
| Udyam | `Module 4: Udyam Registration` | `modules/udyam.spec.js` | 3 |
| Add Product | `Module 5: Add Product` | `modules/product.spec.js` | 5 |
| Demographics | `Module 6: Demographics and Address` | `modules/demographics.spec.js` | 7 |
| History | `Module 7: History and Business` | `modules/applicant.spec.js` | 3 |
| Primary Applicant | `Module 8: Update Primary Applicant Details` | `modules/applicant.spec.js` | 4 |
| Second Applicant | `Module 9: Add Second Applicant` | `modules/applicant.spec.js` | 3 |
| PSL | `Module 10: Priority Sector Lending (PSL)` | `modules/psl.spec.js` | 5 |
| Financial Info | `Module 12: Financial Info` | `modules/financials.spec.js` | 4 |
| Takeover | `Module 13: Take Over Details` | `modules/financials.spec.js` | 5 |
| GST | `Module 14: GST Details` | `modules/gst.spec.js` | 3 |
| ITR & P&L | `Module 15: ITR and P&L` | `modules/gst.spec.js` | 3 |
| Bank Statements | `Module 16: Bank Statements` | `modules/bankStatement.spec.js` | 6 |
| Security | `Module 17: Security Details` | `modules/bankStatement.spec.js` | 4 |
| Sourcing + Submit | `Module 18: Sourcing Details and Final Submit` | `modules/sourcing.spec.js` | 6 |
| **Subtotal (unit + module)** | | | **97** |
| Journey DDT dataset 1 | `RM Journey - [DATA: High Value BBG - Manufacturing]` | `journey.spec.js` | 18 |
| Journey DDT dataset 2 | `RM Journey - [DATA: High Value BBG - Service Sector]` | `journey.spec.js` | 18 |
| **Total (all suites)** | | | **133** |

---

## Pre-condition Chain Reference

Each module spec navigates through all prior modules in `beforeAll`. This table shows the exact chain:

| Module Spec | beforeAll Navigation Chain |
|---|---|
| `dashboard.spec.js` | Login → OTP |
| `createLead.spec.js` | Login → OTP → Dashboard |
| `customerProfile.spec.js` | loginAndOTP → Dashboard → Consent Tab |
| `udyam.spec.js` | loginAndOTP → createLeadAndConsent → selectCustomer |
| `product.spec.js` | ↑ + addUdyamRegistration |
| `demographics.spec.js` | ↑ + addProduct |
| `applicant.spec.js` (M-07) | ↑ + addDemographicsAndAddress |
| `applicant.spec.js` (M-08, M-09) | ↑ + addHistoryAndBusiness |
| `psl.spec.js` | ↑ same as M-08 |
| `financials.spec.js` | ↑ + updateApplicantDetails + addSecondApplicant + addPSL + uploadDocumentation |
| `gst.spec.js` | ↑ + addFinancialInfo + addTakeOver |
| `bankStatement.spec.js` | ↑ + addGST + addITRAndPL |
| `sourcing.spec.js` | ↑ + addBankStatements + addSecurity |

---

*Last updated: March 2026 — synced verbatim from all 13 spec files (login.spec.js + 12 module specs + journey.spec.js)*
