import { test, expect } from '@playwright/test';
import { testConfig }  from '../config/testConfig.js';
import { JourneyPage } from '../pages/JourneyPage.js';
import journeyData from '../data/journeyData.json' assert { type: 'json' };
const data = journeyData[0];

let sharedPage, jp;

async function navigateToBankStatements(browser) {
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
    await jp.addGST(data);
    await jp.addITRAndPL(data);
}

// ─── Module 16: Bank Statements ───────────────────────────────────────────────
test.describe.serial('Module 16: Bank Statements', () => {

    test.beforeAll(async ({ browser }) => { await navigateToBankStatements(browser); });
    test.afterAll(async () => { if (sharedPage) await sharedPage.close(); });

    test('M-16a: Bank Statements section heading is visible', async () => {
        const heading = sharedPage.getByRole('heading', { name: 'Bank Statements' });
        await expect(heading).toBeVisible({ timeout: 10_000 });
        await heading.click();
    });

    test('M-16b: Select Bank dropdown is available', async () => {
        // Some flows require clicking "manual upload" first
        await sharedPage.getByRole('button', { name: 'manual upload' }).click().catch(() => {});
        const bankDdl = sharedPage.getByText('Select Bank');
        await expect(bankDdl).toBeVisible({ timeout: 5_000 });
    });

    test('M-16c: Bank dropdown populates with selectable bank names', async () => {
        await sharedPage.getByText('Select Bank').click();
        const options = sharedPage.getByRole('option');
        expect(await options.count()).toBeGreaterThan(0);
        await sharedPage.getByRole('option', { name: data.bankStatement.bankName }).click();
    });

    test('M-16d: Account number field accepts numeric input', async () => {
        const accountInput = sharedPage.getByPlaceholder('Account Number');
        await accountInput.fill(data.bankStatement.accountNumber);
        await expect(accountInput).toHaveValue(data.bankStatement.accountNumber);
    });

    test('M-16e: Existing OD Yes/No toggle works', async () => {
        if (data.bankStatement.existingOD === 'Yes') {
            await sharedPage.getByRole('button', { name: 'Yes' }).click();
            const limitInput = sharedPage.getByPlaceholder('Limit');
            await expect(limitInput).toBeVisible({ timeout: 3_000 });
        } else {
            await sharedPage.getByRole('button', { name: 'No' }).click();
            // Limit field should not appear
            const limitInput = sharedPage.getByPlaceholder('Limit');
            expect(await limitInput.isVisible().catch(() => false)).toBe(false);
        }
    });

    test('M-16f: Perfios terms and conditions checkbox is present', async () => {
        const termsText = sharedPage.getByText(/terms and conditions for perfios/i).first();
        await expect(termsText).toBeVisible({ timeout: 5_000 });
    });
});

// ─── Module 17: Security Details ──────────────────────────────────────────────
test.describe.serial('Module 17: Security Details', () => {

    test.beforeAll(async ({ browser }) => { await navigateToBankStatements(browser); });
    test.afterAll(async () => { if (sharedPage) await sharedPage.close(); });

    test('M-17a: Security section heading is visible', async () => {
        const heading = sharedPage.getByRole('heading', { name: 'Security' });
        await expect(heading).toBeVisible({ timeout: 10_000 });
        await heading.click();
    });

    test('M-17b: Add Security button opens security form', async () => {
        await sharedPage.getByRole('button', { name: '+ Add Security' }).click();
        const typeDdl = sharedPage.getByText('Please select').first();
        await expect(typeDdl).toBeVisible({ timeout: 5_000 });
    });

    test('M-17c: Security type dropdown has selectable options', async () => {
        await sharedPage.getByText('Please select').first().click();
        const options = sharedPage.getByRole('option');
        expect(await options.count()).toBeGreaterThan(0);
        await sharedPage.getByRole('option', { name: data.security.type }).click();
    });

    test('M-17d: Collateral value field accepts currency amount', async () => {
        await sharedPage.locator('#collateralMarketValue').nth(1).fill(data.security.collateralValue);
        await expect(sharedPage.locator('#collateralMarketValue').nth(1))
            .toHaveValue(data.security.collateralValue);
    });
});
