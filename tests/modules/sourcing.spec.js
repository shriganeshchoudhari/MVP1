import { test, expect } from '@playwright/test';
import { testConfig }  from '../config/testConfig.js';
import { JourneyPage } from '../pages/JourneyPage.js';
import journeyData from '../data/journeyData.json' assert { type: 'json' };
const data = journeyData[0];

let sharedPage, jp;

test.describe.serial('Module 18: Sourcing Details and Final Submit', () => {

    test.beforeAll(async ({ browser }) => {
        sharedPage = await browser.newPage();
        jp = new JourneyPage(sharedPage);
        // Navigate through all modules to reach sourcing
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
        await jp.addBankStatements(data);
        await jp.addSecurity(data);
    });

    test.afterAll(async () => { if (sharedPage) await sharedPage.close(); });

    test('M-18a: Actions menu is accessible', async () => {
        const actionsLink = sharedPage.locator('a').filter({ hasText: 'Actions' }).first();
        await expect(actionsLink).toBeVisible({ timeout: 10_000 });
    });

    test('M-18b: Sourcing Details option appears in Actions menu', async () => {
        await sharedPage.locator('a').filter({ hasText: 'Actions' }).click();
        const sourcingOption = sharedPage.locator('div').filter({ hasText: 'Sourcing Details' }).nth(5);
        await expect(sourcingOption).toBeVisible({ timeout: 5_000 });
    });

    test('M-18c: Branch dropdown is searchable and selectable', async () => {
        await sharedPage.locator('div').filter({ hasText: 'Sourcing Details' }).nth(5).click();
        await sharedPage.getByText('Select Branch').click();
        const filter = sharedPage.locator('.p-dropdown-filter');
        await filter.fill(data.sourcing.branchSearch);
        const option = sharedPage.getByRole('option', { name: data.sourcing.branch });
        await expect(option).toBeVisible({ timeout: 5_000 });
        await option.click();
    });

    test('M-18d: CCPA Code dropdown is searchable and selectable', async () => {
        await sharedPage.getByText('Select CCPA Code').click();
        await sharedPage.locator('.p-dropdown-filter').fill(data.sourcing.ccpaSearch);
        const option = sharedPage.getByRole('option', { name: data.sourcing.ccpa });
        await expect(option).toBeVisible({ timeout: 5_000 });
        await option.click();
    });

    test('M-18e: Submit button is enabled after branch and CCPA selection', async () => {
        const submitBtn = sharedPage.getByRole('button', { name: 'Submit' });
        await expect(submitBtn).toBeEnabled({ timeout: 5_000 });
    });

    test('M-18f: Clicking Submit completes the journey (success dialog appears)', async () => {
        await sharedPage.getByRole('button', { name: 'Submit' }).click();
        // After submit, a confirmation dialog / close icon appears
        const closeIcon = sharedPage.getByRole('img', { name: 'close icon' });
        const successMsg = sharedPage.locator('text=/success|submitted|application/i').first();
        const confirmed = await closeIcon.isVisible({ timeout: 15_000 }).catch(() => false)
            || await successMsg.isVisible({ timeout: 15_000 }).catch(() => false);
        expect(confirmed, 'No confirmation shown after submit').toBe(true);
    });
});
