import { test, expect } from '@playwright/test';
import { testConfig }  from '../config/testConfig.js';
import { JourneyPage } from '../pages/JourneyPage.js';
import journeyData from '../data/journeyData.json' assert { type: 'json' };
const data = journeyData[0];

let sharedPage, jp;

test.describe.serial('Module 5: Add Product', () => {

    test.beforeAll(async ({ browser }) => {
        sharedPage = await browser.newPage();
        jp = new JourneyPage(sharedPage);
        await jp.loginAndOTP(testConfig.credentials);
        await jp.createLeadAndConsent(data);
        await jp.selectCustomer(data);
        await jp.addUdyamRegistration(data);
    });

    test.afterAll(async () => {
        if (sharedPage) await sharedPage.close();
    });

    test('M-05a: Sector dropdown is visible and selectable', async () => {
        const sectorDdl = sharedPage.getByText('Select Sector');
        await expect(sectorDdl).toBeVisible({ timeout: 10_000 });
        await sectorDdl.click();
        const option = sharedPage.getByRole('option', { name: data.sector });
        await expect(option).toBeVisible();
        await option.click();
    });

    test('M-05b: Add Product button appears after sector selection', async () => {
        const addBtn = sharedPage.getByRole('button', { name: '+ Add Product' });
        await expect(addBtn).toBeVisible({ timeout: 5_000 });
    });

    test('M-05c: Facility type dropdown opens when Add Product clicked', async () => {
        await sharedPage.getByRole('button', { name: '+ Add Product' }).click();
        const facilityTypeDdl = sharedPage.locator('#facilityCode').getByText('Select Type');
        await expect(facilityTypeDdl).toBeVisible({ timeout: 5_000 });
    });

    test('M-05d: Facility 1 (Cash Credit) can be configured and added', async () => {
        await sharedPage.locator('#facilityCode').getByText('Select Type').click();
        await sharedPage.getByText(data.facility1.type).click();
        await sharedPage.locator('#loanPurpose').getByText('Select Type').click();
        await sharedPage.getByText(data.facility1.purpose).click();
        await sharedPage.locator('#loanAmount').nth(1).fill(data.facility1.amount);
        await sharedPage.getByText('Select Type').first().click();
        await sharedPage.getByRole('option', { name: 'NORMAL' }).click();
        await sharedPage.getByRole('button', { name: 'Add', exact: true }).click();
        // The first facility row should now appear in the list
        const facilityRow = sharedPage.locator('text=' + data.facility1.type).first();
        await expect(facilityRow).toBeVisible({ timeout: 5_000 });
    });

    test('M-05e: Two facilities can be added before proceeding', async () => {
        // Add second facility
        await sharedPage.getByRole('button', { name: '+ Add Product' }).click();
        await sharedPage.locator('#facilityCode').getByText('Select Type').click();
        await sharedPage.getByRole('option', { name: data.facility2.type }).click();
        await sharedPage.locator('#loanPurpose').getByText('Select Type').click();
        await sharedPage.getByText(data.facility2.purpose).click();
        await sharedPage.locator('#loanAmount').nth(1).fill(data.facility2.amount);
        await sharedPage.getByText('Select Tenure').click();
        await sharedPage.getByRole('option', { name: data.facility2.tenure }).click();
        await sharedPage.getByText('Select Type').first().click();
        await sharedPage.getByRole('option', { name: 'NORMAL' }).click();
        await sharedPage.getByRole('button', { name: 'Add', exact: true }).click();

        const facilityRows = sharedPage.locator('.facility-row, tr:has-text("Cash Credit"), tr:has-text("Term Loan")');
        const count = await facilityRows.count();
        expect(count, 'Expected at least 2 facility rows').toBeGreaterThanOrEqual(2);
    });
});
