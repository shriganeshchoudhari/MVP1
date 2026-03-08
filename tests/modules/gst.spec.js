import { test, expect } from '@playwright/test';
import { testConfig }  from '../config/testConfig.js';
import { JourneyPage } from '../pages/JourneyPage.js';
import journeyData from '../data/journeyData.json' assert { type: 'json' };
const data = journeyData[0];

let sharedPage, jp;

async function navigateToGST(browser) {
    sharedPage = await browser.newPage();
    jp = new JourneyPage(sharedPage);
    await jp.loginAndOTP(testConfig.credentials);
    await jp.createLeadAndConsent(data);
    await jp.selectCustomer(data);
    await jp.addUdyamRegistration(data);
    await jp.addProduct(data);
    await jp.addDemographicsAndAddress(data);
    await jp.addHistoryAndBusiness(data);
    await jp.updateApplicantDetails(data);
    await jp.addSecondApplicant(data);
    await jp.addPSL(data);
    await jp.uploadDocumentation(data.docs || {});
    await jp.addFinancialInfo(data);
    await jp.addTakeOver(data);
}

// ─── Module 14: GST ───────────────────────────────────────────────────────────
test.describe.serial('Module 14: GST Details', () => {

    test.beforeAll(async ({ browser }) => { await navigateToGST(browser); });
    test.afterAll(async () => { if (sharedPage) await sharedPage.close(); });

    test('M-14a: GST section heading is visible', async () => {
        const heading = sharedPage.getByRole('heading', { name: 'GST' });
        await expect(heading).toBeVisible({ timeout: 10_000 });
        await heading.click();
    });

    test('M-14b: Add Monthly Sales button opens 12-month input grid', async () => {
        await sharedPage.getByRole('button', { name: '+ Add Monthly Sales' }).click();
        const firstMonthInput = sharedPage.locator('#month0');
        await expect(firstMonthInput).toBeVisible({ timeout: 5_000 });
    });

    test('M-14c: All 12 monthly GST sale fields accept values', async () => {
        const gst = data.gst.monthlySales;
        for (let i = 0; i < gst.length; i++) {
            const input = sharedPage.locator(`#month${i}`);
            if (await input.isVisible().catch(() => false)) {
                await input.fill(gst[i]);
            }
        }
        // Verify at least the first and last filled correctly
        await expect(sharedPage.locator('#month0')).toHaveValue(gst[0]);
        await expect(sharedPage.locator(`#month${gst.length - 1}`)).toHaveValue(gst[gst.length - 1]);
    });
});

// ─── Module 15: ITR & P&L ─────────────────────────────────────────────────────
test.describe.serial('Module 15: ITR and P&L', () => {

    test.beforeAll(async ({ browser }) => { await navigateToGST(browser); });
    test.afterAll(async () => { if (sharedPage) await sharedPage.close(); });

    test('M-15a: ITR & P&L section heading is visible', async () => {
        const heading = sharedPage.getByRole('heading', { name: 'ITR & P&L' });
        await expect(heading).toBeVisible({ timeout: 10_000 });
        await heading.click();
    });

    test('M-15b: Upload manually option is available', async () => {
        const uploadOption = sharedPage.getByText('Upload manually');
        await expect(uploadOption).toBeVisible({ timeout: 5_000 });
    });

    test('M-15c: Confirm checkbox exists for document upload acknowledgement', async () => {
        if (await sharedPage.getByText('Upload manually').isVisible().catch(() => false)) {
            await sharedPage.getByText('Upload manually').click();
        }
        const confirmText = sharedPage.getByText(/confirm.*process.*uploaded/i).first();
        await expect(confirmText).toBeVisible({ timeout: 5_000 });
    });
});
