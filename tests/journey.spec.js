import { test, expect } from '@playwright/test';
import { testConfig } from './config/testConfig.js';
import * as journeyModules from './modules/journeyModules.js';

test.describe.serial('RM Journey - Modular Execution', () => {
    let page;

    test.beforeAll(async ({ browser }) => {
        // Shared page across all sequential modules
        page = await browser.newPage();
    });

    test.afterAll(async () => {
        if (page) {
            await page.close();
        }
    });

    test('Module 1: Login and OTP', async () => {
        await journeyModules.loginAndOTP(page);
    });

    test('Module 2: Create Lead and Consent', async () => {
        await journeyModules.createLeadAndConsent(page);
    });

    test('Module 3: Select Customer and Add Product', async () => {
        await journeyModules.selectCustomerAndAddProduct(page);
    });

    test('Module 4: Add Demographics and Address', async () => {
        await journeyModules.addDemographicsAndAddress(page);
    });

    test('Module 5: Add History and Business', async () => {
        await journeyModules.addHistoryAndBusiness(page);
    });

    test('Module 6: Update Applicant Details', async () => {
        await journeyModules.updateApplicantDetails(page);
    });

    test('Module 7: Add Priority Sector Lending (PSL)', async () => {
        await journeyModules.addPSL(page);
    });

    test('Module 8: Upload Documentation', async () => {
        await journeyModules.uploadDocumentation(page);
    });

    test('Module 9: Add Financial Info', async () => {
        await journeyModules.addFinancialInfo(page);
    });

    test('Module 10: Add Take Over Details', async () => {
        await journeyModules.addTakeOver(page);
    });

    test('Module 11: Add GST Details', async () => {
        await journeyModules.addGST(page);
    });

    test('Module 12: Add Security Details', async () => {
        await journeyModules.addSecurity(page);
    });

    test('Module 13: Add Sourcing Details and Submit', async () => {
        await journeyModules.addSourcingAndSubmit(page);
    });
});
