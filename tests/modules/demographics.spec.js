import { test, expect } from '@playwright/test';
import { testConfig }  from '../config/testConfig.js';
import { JourneyPage } from '../pages/JourneyPage.js';
import journeyData from '../data/journeyData.json' assert { type: 'json' };
const data = journeyData[0];

let sharedPage, jp;

test.describe.serial('Module 6: Demographics and Address', () => {

    test.beforeAll(async ({ browser }) => {
        sharedPage = await browser.newPage();
        jp = new JourneyPage(sharedPage);
        await jp.loginAndOTP(testConfig.credentials);
        await jp.createLeadAndConsent(data);
        await jp.selectCustomer(data);
        await jp.addUdyamRegistration(data);
        await jp.addProduct(data);
    });

    test.afterAll(async () => {
        if (sharedPage) await sharedPage.close();
    });

    test('M-06a: Demographics section renders with email and industry fields', async () => {
        const emailInput = sharedPage.getByRole('textbox').nth(1);
        await expect(emailInput).toBeVisible({ timeout: 10_000 });
        const industryDdl = sharedPage.getByText('Select Industry');
        await expect(industryDdl).toBeVisible();
    });

    test('M-06b: Email field accepts valid email address', async () => {
        const emailInput = sharedPage.getByRole('textbox').nth(1);
        await emailInput.fill(data.demographics.email);
        await expect(emailInput).toHaveValue(data.demographics.email);
    });

    test('M-06c: Industry dropdown populates with options', async () => {
        await sharedPage.getByText('Select Industry').click();
        const options = sharedPage.getByRole('option');
        const count = await options.count();
        expect(count, 'Industry dropdown should have options').toBeGreaterThan(0);
        // Close without selecting to not advance state
        await sharedPage.keyboard.press('Escape');
    });

    test('M-06d: Date of Incorporation field accepts dd-mm-yyyy format', async () => {
        const dateInput = sharedPage.getByRole('textbox', { name: 'dd-mm-yyyy' }).first();
        await dateInput.fill(data.demographics.dateOfIncorporation);
        await dateInput.press('Tab');
        await expect(dateInput).toHaveValue(data.demographics.dateOfIncorporation);
    });

    test('M-06e: Add Permanent Address button is visible', async () => {
        const addAddrBtn = sharedPage.getByRole('button', { name: '+ Add Permanent Address' });
        await expect(addAddrBtn).toBeVisible({ timeout: 5_000 });
    });

    test('M-06f: Address form opens when Add Permanent Address clicked', async () => {
        await sharedPage.getByRole('button', { name: '+ Add Permanent Address' }).click();
        await sharedPage.getByRole('button', { name: '+ Add New' }).click();
        const addressLine1 = sharedPage.locator('#addressLine1').nth(1);
        await expect(addressLine1).toBeVisible({ timeout: 5_000 });
    });

    test('M-06g: All address line fields can be filled', async () => {
        const addr = data.address;
        await sharedPage.locator('#addressLine1').nth(1).fill(addr.line1);
        await sharedPage.locator('#addressLine2').nth(1).fill(addr.line2);
        await sharedPage.locator('#addressLine3').nth(1).fill(addr.line3);
        await sharedPage.locator('#addressLine4').nth(1).fill(addr.line4);
        await sharedPage.locator('#addressLine5').nth(1).fill(addr.line5);
        await sharedPage.getByRole('spinbutton').fill(addr.pincode);
        await expect(sharedPage.locator('#addressLine1').nth(1)).toHaveValue(addr.line1);
    });
});
