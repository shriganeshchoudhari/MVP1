import { test, expect } from '@playwright/test';
import { testConfig }  from '../config/testConfig.js';
import { JourneyPage } from '../pages/JourneyPage.js';
import journeyData from '../data/journeyData.json' assert { type: 'json' };
const data = journeyData[0];

let sharedPage, jp;

async function navigateToFinancials(browser) {
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
}

// ─── Module 12: Financial Info ────────────────────────────────────────────────
test.describe.serial('Module 12: Financial Info', () => {

    test.beforeAll(async ({ browser }) => { await navigateToFinancials(browser); });
    test.afterAll(async () => { if (sharedPage) await sharedPage.close(); });

    test('M-12a: Financial Info section is visible', async () => {
        const heading = sharedPage.getByRole('heading', { name: 'Financial Info' });
        await expect(heading).toBeVisible({ timeout: 10_000 });
    });

    test('M-12b: Secured Loan field accepts currency amount', async () => {
        await sharedPage.getByRole('heading', { name: 'Financial Info' }).click();
        await sharedPage.locator('#securedLoan').nth(1).fill(data.financials.securedLoan);
        await expect(sharedPage.locator('#securedLoan').nth(1)).toHaveValue(data.financials.securedLoan);
    });

    test('M-12c: CA Number, CA Name and UDIN fields are fillable', async () => {
        await sharedPage.locator('#caNumber').nth(1).fill(data.financials.caNumber);
        await sharedPage.locator('#caName').nth(1).fill(data.financials.caName);
        await sharedPage.locator('#udinNo').nth(1).fill(data.financials.udinNo);
        await expect(sharedPage.locator('#caNumber').nth(1)).toHaveValue(data.financials.caNumber);
    });

    test('M-12d: Projected Sales and Term Loan fields accept values', async () => {
        await sharedPage.locator('#termLoan').nth(1).fill(data.financials.termLoan);
        await sharedPage.locator('#totalProjectedSales').nth(1).fill(data.financials.totalProjectedSales);
        await expect(sharedPage.locator('#termLoan').nth(1)).toHaveValue(data.financials.termLoan);
    });
});

// ─── Module 13: Takeover ──────────────────────────────────────────────────────
test.describe.serial('Module 13: Take Over Details', () => {

    test.beforeAll(async ({ browser }) => { await navigateToFinancials(browser); });
    test.afterAll(async () => { if (sharedPage) await sharedPage.close(); });

    test('M-13a: Takeover section heading is visible', async () => {
        const heading = sharedPage.getByRole('heading', { name: 'Take Over' });
        await expect(heading).toBeVisible({ timeout: 10_000 });
        await heading.click();
    });

    test('M-13b: Add Takeover button opens takeover form', async () => {
        await sharedPage.getByRole('button', { name: '+ Add Takeover' }).click();
        const typeDdl = sharedPage.getByText('Select Type').first();
        await expect(typeDdl).toBeVisible({ timeout: 5_000 });
    });

    test('M-13c: Type dropdown has selectable options', async () => {
        await sharedPage.getByText('Select Type').first().click();
        const options = sharedPage.getByRole('option');
        expect(await options.count()).toBeGreaterThan(0);
        await sharedPage.getByRole('option', { name: data.takeOver.type }).click();
    });

    test('M-13d: IFSC code field validates on Tab', async () => {
        await sharedPage.locator('#ifscCode').getByRole('textbox').fill(data.takeOver.ifscCode);
        await sharedPage.locator('#ifscCode').getByRole('textbox').press('Tab');
        await expect(sharedPage.locator('#ifscCode').getByRole('textbox')).toHaveValue(data.takeOver.ifscCode);
    });

    test('M-13e: Bank account number and loan amount fields accept values', async () => {
        await sharedPage.locator('#bankAccountNumber').nth(1).fill(data.takeOver.bankAccountNumber);
        await sharedPage.locator('#loanAmount').nth(1).fill(data.takeOver.loanAmount);
        await expect(sharedPage.locator('#bankAccountNumber').nth(1)).toHaveValue(data.takeOver.bankAccountNumber);
    });
});
