import { test, expect } from '@playwright/test';
import { testConfig } from '../config/testConfig.js';
import { LoginPage }     from '../pages/LoginPage.js';
import { OtpPage }       from '../pages/OtpPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';

// ─── Shared auth state (login once, reuse across tests) ──────────────────────
let sharedPage;

test.describe('Dashboard — My Queue', () => {

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
    });

    test.afterAll(async () => {
        if (sharedPage) await sharedPage.close();
    });

    // D-01
    test('D-01: My Queue renders with 3 tabs (Pending / Submitted / Consent)', async () => {
        const dash = new DashboardPage(sharedPage);
        await dash.waitForDashboard();
        const tabs = await dash.verifyQueueTabs();
        expect(tabs.pending,   'Pending tab missing').toBe(true);
        expect(tabs.submitted, 'Submitted tab missing').toBe(true);
        expect(tabs.consent,   'Consent tab missing').toBe(true);
    });

    // D-02
    test('D-02: ARN search input is visible and accepts text', async () => {
        const dash = new DashboardPage(sharedPage);
        await dash.waitForDashboard();
        await expect(dash.arnSearchInput).toBeVisible();
        await dash.arnSearchInput.fill('ARN123456');
        await expect(dash.arnSearchInput).toHaveValue('ARN123456');
    });

    // D-03
    test('D-03: Consent tab is clickable and renders consent grid', async () => {
        const dash = new DashboardPage(sharedPage);
        await dash.waitForDashboard();
        await dash.clickConsentTab();
        // The consent grid table should be present (may be empty; just verify it renders)
        await expect(dash.consentGrid).toBeVisible({ timeout: 10_000 });
    });

    // D-04
    test('D-04: Create New button is visible and navigates to lead creation', async () => {
        const dash = new DashboardPage(sharedPage);
        await dash.waitForDashboard();
        await expect(dash.createNewBtn).toBeVisible();
        await dash.clickCreateNew();
        // A modal / drawer with mobile number input should appear
        await expect(sharedPage.locator('#mobileNumber, input[placeholder*="Mobile"]').first())
            .toBeVisible({ timeout: 10_000 });
    });
});
