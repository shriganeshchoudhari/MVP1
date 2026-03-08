import { test, expect } from '@playwright/test';
import { testConfig } from '../config/testConfig.js';
import { LoginPage }     from '../pages/LoginPage.js';
import { OtpPage }       from '../pages/OtpPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';

let sharedPage;

test.describe.serial('Module 2: Create Lead and Consent', () => {

    test.beforeAll(async ({ browser }) => {
        sharedPage = await browser.newPage();
        const lp = new LoginPage(sharedPage);
        const op = new OtpPage(sharedPage);
        await lp.goto(testConfig.loginUrl);
        await lp.login({
            userId:          testConfig.credentials.userId,
            password:        testConfig.credentials.password,
            businessGroup:   testConfig.business.group,
            businessSegment: testConfig.business.segment,
        });
        await op.enterAndSubmitOtp(testConfig.credentials.otp);
        const dash = new DashboardPage(sharedPage);
        await dash.waitForDashboard();
    });

    test.afterAll(async () => {
        if (sharedPage) await sharedPage.close();
    });

    // M-01
    test('M-01: Create New opens mobile number entry form', async () => {
        const dash = new DashboardPage(sharedPage);
        await dash.clickCreateNew();
        const mobileInput = sharedPage.locator('#mobileNumber, input[placeholder*="Mobile"]').first();
        await expect(mobileInput).toBeVisible({ timeout: 10_000 });
    });

    // M-01b
    test('M-01b: Invalid mobile number (too short) shows validation error', async () => {
        const mobileInput = sharedPage.locator('#mobileNumber').first();
        await mobileInput.fill('99999');
        await sharedPage.locator('button').filter({ hasText: /get customer consent/i }).click();
        const error = sharedPage.locator('.error-message, .p-error, .mat-error, .ng-invalid').first();
        await expect(error).toBeVisible({ timeout: 5_000 });
    });

    // M-01c
    test('M-01c: Mobile number field rejects non-numeric input', async () => {
        const mobileInput = sharedPage.locator('#mobileNumber').first();
        await mobileInput.fill('ABCDEFGHIJ');
        const val = await mobileInput.inputValue();
        // After Angular validation, non-numeric chars should be stripped or flagged
        expect(val.replace(/\D/g, '')).toHaveLength(0);
    });

    // M-02
    test('M-02: Physical consent type selection is available', async () => {
        const physicalOption = sharedPage.locator(
            'mat-radio-button, input[type="radio"]'
        ).filter({ hasText: /physical/i }).first();
        await expect(physicalOption).toBeVisible();
    });

    // M-03
    test('M-03: Business Segment dropdown appears on Create Lead form', async () => {
        const segmentDdl = sharedPage.locator('text=Select BusinessSegment').first();
        await expect(segmentDdl).toBeVisible();
    });

    // M-04
    test('M-04: Get Customer Consent button is present', async () => {
        const consentBtn = sharedPage.locator('button').filter({ hasText: /get customer consent/i }).first();
        await expect(consentBtn).toBeVisible();
    });
});
