import { test, expect } from '@playwright/test';
import { testConfig } from './config/testConfig.js';
import { JourneyPage } from './pages/JourneyPage.js';
import APIAnalyzer from './utils/apiAnalyzer.js';
// Load Data Strategy JSON
import journeyData from './data/journeyData.json' assert { type: 'json' };

// Since the JSON is an array, we loop through it to dynamically create a test suite per user requirement data set.
for (const data of journeyData) {

    test.describe.serial(`RM Journey - [DATA: ${data.testName}]`, () => {
        let page;
        let apiAnalyzer;
        let journeyPage; // The POM instance

        test.beforeAll(async ({ browser }) => {
            // Share the authenticated page across modules
            page = await browser.newPage();
            journeyPage = new JourneyPage(page);

            apiAnalyzer = new APIAnalyzer();

            // Start API Tracking
            page.on('response', async (response) => {
                const req = response.request();
                if (['fetch', 'xhr'].includes(req.resourceType())) {
                    let postData = null;
                    try { postData = JSON.parse(req.postData() || '{}'); } catch (e) { }

                    apiAnalyzer.apiCalls.push({
                        module: apiAnalyzer.currentModule,
                        method: req.method(),
                        url: req.url(),
                        status: response.status(),
                        payload: postData || null
                    });
                }
            });
        });

        test.beforeEach(async ({ }, testInfo) => {
            if (apiAnalyzer) apiAnalyzer.setModule(testInfo.title);
        });

        test.afterAll(async () => {
            if (apiAnalyzer) {
                // Export report differentiated by dataset name
                const safeName = data.testName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                apiAnalyzer.generateReport(`test-results/api-analysis-${safeName}.md`);
            }
            if (page) await page.close();
        });

        test('Module 1: Login and OTP', async () => {
            await journeyPage.loginAndOTP(testConfig.credentials);
        });

        test('Module 2: Create Lead and Consent', async () => {
            await journeyPage.createLeadAndConsent(data);
        });

        test('Module 3: Select Customer Profile', async () => {
            await journeyPage.selectCustomer(data);
        });

        test('Module 4: Udyam Registration', async () => {
            await journeyPage.addUdyamRegistration(data);
        });

        test('Module 5: Add Product', async () => {
            await journeyPage.addProduct(data);
        });

        test('Module 6: Add Demographics and Address', async () => {
            await journeyPage.addDemographicsAndAddress(data);
        });

        test('Module 7: Add History and Business', async () => {
            await journeyPage.addHistoryAndBusiness(data);
        });

        test('Module 8: Update Primary Applicant Details', async () => {
            await journeyPage.updateApplicantDetails(data);
        });

        test('Module 9: Add Second Applicant', async () => {
            await journeyPage.addSecondApplicant(data);
        });

        test('Module 10: Add Priority Sector Lending (PSL)', async () => {
            await journeyPage.addPSL(data);
        });

        test('Module 11: Upload Documentation', async () => {
            await journeyPage.uploadDocumentation(data.docs || {});
        });

        test('Module 12: Add Financial Info', async () => {
            await journeyPage.addFinancialInfo(data);
        });

        test('Module 13: Add Take Over Details', async () => {
            await journeyPage.addTakeOver(data);
        });

        test('Module 14: Add GST Details', async () => {
            await journeyPage.addGST(data);
        });

        test('Module 15: Add ITR & P&L', async () => {
            await journeyPage.addITRAndPL(data);
        });

        test('Module 16: Add Bank Statements', async () => {
            await journeyPage.addBankStatements(data);
        });

        test('Module 17: Add Security Details', async () => {
            await journeyPage.addSecurity(data);
        });

        test('Module 18: Add Sourcing Details and Submit', async () => {
            await journeyPage.addSourcingAndSubmit(data);
        });
    });
}
