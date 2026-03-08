import { test, expect } from '@playwright/test';
import { testConfig } from '../config/testConfig.js';
import { JourneyPage }   from '../pages/JourneyPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';

// Use first dataset from journeyData for selector tests
import journeyData from '../data/journeyData.json' assert { type: 'json' };
const data = journeyData[0];

let sharedPage;

test.describe.serial('Module 3: Customer Profile (PAN Entry)', () => {

    test.beforeAll(async ({ browser }) => {
        sharedPage = await browser.newPage();
        const jp = new JourneyPage(sharedPage);
        await jp.loginAndOTP(testConfig.credentials);
        const dash = new DashboardPage(sharedPage);
        await dash.waitForDashboard();
        await dash.clickConsentTab();
    });

    test.afterAll(async () => {
        if (sharedPage) await sharedPage.close();
    });

    // M-02 (selecting from consent grid)
    test('M-02: Consent grid row is clickable — proceeds to PAN page', async () => {
        // Click the row matching our test mobile number
        const row = sharedPage.locator(`tr:has-text("${data.mobileNumber}"), .p-datatable-row:has-text("${data.mobileNumber}")`).first();
        await row.waitFor({ state: 'visible', timeout: 15_000 });
        await row.click();
        // PAN input should appear
        const panInput = sharedPage.locator('input[placeholder*="PAN"], #panNumber').first();
        await expect(panInput).toBeVisible({ timeout: 10_000 });
    });

    // M-03
    test('M-03: Valid PAN triggers API fetch and pre-fills company name', async () => {
        const panInput = sharedPage.locator('input[placeholder*="PAN"], #panNumber').first();
        await panInput.fill(data.panNumber);
        await panInput.press('Tab');
        // Wait for API to fetch details
        await sharedPage.waitForTimeout(2000);
        // Company name field should be pre-filled after PAN verification
        const companyInput = sharedPage.locator('#zebra, input[placeholder*="Company"]').first();
        await expect(companyInput).not.toBeEmpty();
    });

    // M-03b
    test('M-03b: Invalid PAN format shows validation error', async () => {
        const panInput = sharedPage.locator('input[placeholder*="PAN"], #panNumber').first();
        await panInput.fill('INVALID123');
        await panInput.press('Tab');
        await sharedPage.waitForTimeout(500);
        const error = sharedPage.locator('.error-message, .p-error, .mat-error').first();
        await expect(error).toBeVisible({ timeout: 5_000 });
    });

    // M-03c
    test('M-03c: Pincode field accepts numeric input', async () => {
        const pincodeInput = sharedPage.getByRole('spinbutton').first();
        await pincodeInput.fill(data.companyPincode);
        await expect(pincodeInput).toHaveValue(data.companyPincode);
    });
});
