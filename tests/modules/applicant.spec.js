import { test, expect } from '@playwright/test';
import { testConfig }  from '../config/testConfig.js';
import { JourneyPage } from '../pages/JourneyPage.js';
import journeyData from '../data/journeyData.json' assert { type: 'json' };
const data = journeyData[0];

let sharedPage, jp;

// ─── Pre-navigation helper ────────────────────────────────────────────────────
async function navigateToApplicantStep(browser) {
    sharedPage = await browser.newPage();
    jp = new JourneyPage(sharedPage);
    await jp.loginAndOTP(testConfig.credentials);
    await jp.createLeadAndConsent(data);
    await jp.selectCustomer(data);
    await jp.addUdyamRegistration(data);
    await jp.addProduct(data);
    await jp.addDemographicsAndAddress(data);
    await jp.addHistoryAndBusiness(data);
}

// ─── Module 7: History and Business ──────────────────────────────────────────
test.describe.serial('Module 7: History and Business', () => {

    test.beforeAll(async ({ browser }) => {
        sharedPage = await browser.newPage();
        jp = new JourneyPage(sharedPage);
        await jp.loginAndOTP(testConfig.credentials);
        await jp.createLeadAndConsent(data);
        await jp.selectCustomer(data);
        await jp.addUdyamRegistration(data);
        await jp.addProduct(data);
        await jp.addDemographicsAndAddress(data);
    });

    test.afterAll(async () => { if (sharedPage) await sharedPage.close(); });

    test('M-07a: Add History and Business button is visible', async () => {
        const btn = sharedPage.getByRole('button', { name: '+ Add History and Business' });
        await expect(btn).toBeVisible({ timeout: 10_000 });
    });

    test('M-07b: Textarea accepts business description', async () => {
        await sharedPage.getByRole('button', { name: '+ Add History and Business' }).click();
        const textarea = sharedPage.locator('textarea').first();
        await textarea.fill(data.history.description);
        await expect(textarea).toHaveValue(data.history.description);
    });

    test('M-07c: History entry is saved and Continue advances the journey', async () => {
        await sharedPage.getByRole('button', { name: 'Add', exact: true }).click();
        await sharedPage.getByRole('button', { name: 'Continue' }).click();
        // Applicant section or next step should now be visible
        const applicantSection = sharedPage.locator('text=Applicant, text=Update').first();
        await expect(applicantSection).toBeVisible({ timeout: 10_000 });
    });
});

// ─── Module 8: Primary Applicant Details ─────────────────────────────────────
test.describe.serial('Module 8: Update Primary Applicant Details', () => {

    test.beforeAll(async ({ browser }) => { await navigateToApplicantStep(browser); });
    test.afterAll(async () => { if (sharedPage) await sharedPage.close(); });

    test('M-08a: Applicant edit form opens correctly', async () => {
        await sharedPage.locator('a').nth(5).click();
        await sharedPage.getByRole('button', { name: 'Update' }).click();
        const firstNameInput = sharedPage.locator('#firstName').nth(1);
        await expect(firstNameInput).toBeVisible({ timeout: 10_000 });
    });

    test('M-08b: First and middle name fields accept input', async () => {
        await sharedPage.locator('#firstName').nth(1).fill(data.applicant.firstName);
        await sharedPage.locator('#middleName').nth(1).fill(data.applicant.middleName);
        await expect(sharedPage.locator('#firstName').nth(1)).toHaveValue(data.applicant.firstName);
    });

    test('M-08c: Marital status dropdown has selectable options', async () => {
        await sharedPage.getByText('Select Marital Status').click();
        const option = sharedPage.getByRole('option', { name: data.applicant.maritalStatus });
        await expect(option).toBeVisible();
        await option.click();
    });

    test('M-08d: Religion and Caste dropdowns work correctly', async () => {
        await sharedPage.getByText('Select Religion').click();
        await sharedPage.getByRole('option', { name: data.applicant.religion }).click();
        await sharedPage.getByText('Select Caste').click();
        await sharedPage.getByRole('option', { name: data.applicant.caste, exact: true }).click();
        // Verify caste was selected by checking the dropdown text changed
        const casteDdl = sharedPage.locator('text=' + data.applicant.caste).first();
        await expect(casteDdl).toBeVisible();
    });
});

// ─── Module 9: Second Applicant ───────────────────────────────────────────────
test.describe.serial('Module 9: Add Second Applicant', () => {

    test.beforeAll(async ({ browser }) => { await navigateToApplicantStep(browser); });
    test.afterAll(async () => { if (sharedPage) await sharedPage.close(); });

    test('M-09a: Add Applicant button is visible', async () => {
        const btn = sharedPage.getByRole('button', { name: '+ Add Applicant' });
        await expect(btn).toBeVisible({ timeout: 10_000 });
    });

    test('M-09b: Second applicant type selection renders Entity and Individual options', async () => {
        await sharedPage.getByRole('button', { name: '+ Add Applicant' }).click();
        const entityLabel = sharedPage.getByLabel('Entity');
        const indLabel    = sharedPage.getByLabel('Individual');
        await expect(entityLabel).toBeVisible();
        await expect(indLabel).toBeVisible();
    });

    test('M-09c: Entity type shows additional fields (business name, industry)', async () => {
        await sharedPage.getByLabel('Entity').click();
        const businessName = sharedPage.locator('#businessName').nth(1);
        await expect(businessName).toBeVisible({ timeout: 5_000 });
    });
});
