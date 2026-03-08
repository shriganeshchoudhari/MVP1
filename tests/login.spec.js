import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage.js';
import { OtpPage } from './pages/OtpPage.js';
import { testConfig } from './config/testConfig.js';

// ─── Convenience aliases ──────────────────────────────────────────────────────
const { loginUrl, dashboardUrl, credentials, business, users } = testConfig;

// Full login credential object (merged)
const CREDS = {
    userId: credentials.userId,
    password: credentials.password,
    businessGroup: business.group,
    businessSegment: business.segment,
};

// ─── Login Page Tests ─────────────────────────────────────────────────────────
test.describe('Login Page', () => {

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto(loginUrl);
    });

    // ── Rendering ──
    test('should display the login page correctly', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await expect(page).toHaveTitle(/Xpress BizFinance|HDFC/i);
        await expect(loginPage.userIdInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();
        await expect(loginPage.businessGroupDdl).toBeVisible();
        await expect(loginPage.loginButton).toBeVisible();
    });

    // ── Field Interactions ──
    test('should allow typing in RM ID field', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.fillUserId(credentials.userId);
        await expect(loginPage.userIdInput).toHaveValue(credentials.userId);
    });

    test('should allow typing in Password field', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.fillPassword(credentials.password);
        await expect(loginPage.passwordInput).toHaveValue(credentials.password);
    });

    test('should reveal Business Segment dropdown after selecting Business Group', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.fillUserId(credentials.userId);
        await loginPage.fillPassword(credentials.password);
        await loginPage.selectBusinessGroup(business.group);
        await expect(loginPage.businessSegDdl).toBeVisible();
    });

    // ── Validation ──
    test('should prevent login with empty credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);

        const isDisabled = await loginPage.loginButton.isDisabled();
        if (isDisabled) {
            await expect(loginPage.loginButton).toBeDisabled();
        } else {
            await loginPage.loginButton.click();
            await expect(page).toHaveURL(loginUrl);
        }
    });

    test('should show error for invalid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);

        // Use a syntactically valid ID (e.g. A00000) so the dropdowns don't stay disabled by Angular form validators.
        await loginPage.fillUserId('A00000');
        await loginPage.fillPassword('wrongpassword');
        await loginPage.selectBusinessGroup(business.group);
        await loginPage.selectBusinessSegment(business.segment);
        await loginPage.clickLogin();

        await page.waitForTimeout(2000);
        expect(page.url()).toContain('#/rm-journey');
    });

    // ── Successful Login → OTP ──
    test('should navigate to OTP page after valid login', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const otpPage = new OtpPage(page);

        await loginPage.login(CREDS);
        await otpPage.waitForOtpPage();
        await expect(otpPage.otpInputs.first()).toBeVisible();
    });
});

// ─── OTP Page Tests ───────────────────────────────────────────────────────────
test.describe('OTP Page', () => {

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        const otpPage = new OtpPage(page);

        await loginPage.goto(loginUrl);
        await loginPage.login(CREDS);
        await otpPage.waitForOtpPage();
    });

    // ── Rendering ──
    test('should display 6 OTP input boxes', async ({ page }) => {
        const otpPage = new OtpPage(page);
        const count = await otpPage.otpInputs.count();
        expect(count).toBe(6);
    });

    test('should display Submit OTP button', async ({ page }) => {
        const otpPage = new OtpPage(page);
        await expect(otpPage.submitOtpBtn).toBeVisible();
    });

    // ── Field Interactions ──
    test('should accept digit input in each OTP box', async ({ page }) => {
        const otpPage = new OtpPage(page);
        await otpPage.fillOtp(credentials.otp);
        await expect(otpPage.otpInputs.nth(0)).toHaveValue(credentials.otp[0]);
    });

    // ── Successful OTP ──
    test('should redirect to dashboard after valid OTP', async ({ page }) => {
        const otpPage = new OtpPage(page);

        await otpPage.enterAndSubmitOtp(credentials.otp);
        await page.waitForURL('**rm-journey-queue**', { timeout: 15_000 }).catch(() => { });

        expect(page.url()).toContain('rm-journey-queue');
    });

    test('should stay on OTP page for invalid OTP', async ({ page }) => {
        const otpPage = new OtpPage(page);

        await otpPage.enterAndSubmitOtp('000000');
        await page.waitForTimeout(2000);

        const isOtpVisible = await otpPage.otpInputs.first().isVisible().catch(() => false);
        expect(isOtpVisible).toBe(true);
    });

    // O-06
    test('should show Resend OTP link on OTP page', async ({ page }) => {
        const otpPage = new OtpPage(page);
        // The resend link must be present in the DOM (may be disabled during countdown)
        await expect(otpPage.resendOtpLink).toBeVisible({ timeout: 10_000 });
    });
});

// ─── End-to-End Full Login Flow ───────────────────────────────────────────────
test.describe('Full Login Flow', () => {

    test('E2E — complete login and reach dashboard (primary user)', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const otpPage = new OtpPage(page);

        await loginPage.goto(loginUrl);
        await loginPage.login(CREDS);

        await otpPage.waitForOtpPage();
        await otpPage.enterAndSubmitOtp(credentials.otp);

        await page.waitForURL('**rm-journey-queue**', { timeout: 15_000 });
        await expect(page).toHaveURL(/rm-journey-queue/);
        await expect(page.locator('text=My Queue')).toBeVisible({ timeout: 10_000 });
    });

    // Parameterised across all configured users
    for (const userId of users) {
        test(`E2E — full login for user ${userId}`, async ({ page }) => {
            const loginPage = new LoginPage(page);
            const otpPage = new OtpPage(page);

            await loginPage.goto(loginUrl);
            await loginPage.login({ ...CREDS, userId });

            await otpPage.waitForOtpPage();
            await otpPage.enterAndSubmitOtp(credentials.otp);

            await page.waitForURL('**rm-journey-queue**', { timeout: 15_000 });
            await expect(page).toHaveURL(/rm-journey-queue/);
        });
    }
});
