import { testConfig } from '../config/testConfig.js';
import { LoginPage } from './LoginPage.js';
import { OtpPage } from './OtpPage.js';

export class JourneyPage {
    constructor(page) {
        this.page = page;
    }

    // ── Login and OTP ──
    /**
     * Full login + OTP flow using the proper POMs.
     * Delegates to LoginPage and OtpPage so env-switching works automatically.
     */
    async loginAndOTP(credentials) {
        const loginPage = new LoginPage(this.page);
        const otpPage   = new OtpPage(this.page);

        await loginPage.goto(testConfig.loginUrl);
        await loginPage.login({
            userId:          credentials.userId   || testConfig.credentials.userId,
            password:        credentials.password || testConfig.credentials.password,
            businessGroup:   credentials.businessGroup    || testConfig.business.group,
            businessSegment: credentials.businessSegment  || testConfig.business.segment,
        });
        await otpPage.enterAndSubmitOtp(credentials.otp || testConfig.credentials.otp);

        // Wait for dashboard to confirm auth succeeded
        await this.page.waitForURL('**rm-journey-queue**', { timeout: 20_000 })
            .catch(() => { /* allow tests to handle failure themselves */ });
    }

    // ── Create Lead and Consent ──
    async createLeadAndConsent(data) {
        await this.page.locator('a').filter({ hasText: 'Create New' }).click();
        await this.page.locator('#mobileNumber').click();
        await this.page.locator('#mobileNumber').fill(data.mobileNumber);

        await this.page.locator('#mat-radio-3 > .mat-radio-label > .mat-radio-container > .mat-radio-outer-circle').click();
        await this.page.getByText('Select BusinessSegment').click();
        await this.page.getByRole('option', { name: data.businessSegment }).click();

        await this.page.getByRole('button', { name: 'Get Customer Consent' }).click();
        await this.page.getByText('Please Ensure that a Signed').click();
        await this.page.getByRole('button', { name: 'Next' }).click();

        await this.page.locator('div:nth-child(3) > .d-flex > .tabs > .tab-cards').click();
        await this.page.getByRole('gridcell', { name: data.customerGridId }).click();
    }

    // ── Udyam Registration ──
    async addUdyamRegistration(data) {
        if (data.udyam?.skip) {
            await this.page.getByText('Skip this step').click();
        } else {
            await this.page.getByPlaceholder('Enter Udyam Number').fill(data.udyam.number);
            await this.page.getByRole('button', { name: 'Verify' }).click();
            await this.page.getByRole('button', { name: 'Next' }).click();
        }
    }

    // ── Customer Profile ──
    async selectCustomer(data) {
        await this.page.getByRole('textbox').click();
        await this.page.getByRole('textbox').fill(data.panNumber);

        await this.page.locator('#zebra').nth(1).click();
        await this.page.locator('#zebra').nth(1).fill(data.companyName);
        await this.page.locator('#zebra').nth(1).press('Tab');

        await this.page.getByRole('spinbutton').fill(data.companyPincode);
        await this.page.getByRole('button', { name: 'Next' }).click();
    }

    // ── Add Product ──
    async addProduct(data) {

        await this.page.getByText('Select Sector').click();
        await this.page.getByRole('option', { name: data.sector }).click();
        await this.page.getByText('Working Capital').click();
        await this.page.getByLabel('Working Capital').getByText('Working Capital').click();

        // Facility 1
        await this.page.getByRole('button', { name: '+ Add Product' }).click();
        await this.page.locator('#facilityCode').getByText('Select Type').click();
        await this.page.getByText(data.facility1.type).click();
        await this.page.locator('#loanPurpose').getByText('Select Type').click();
        await this.page.getByText(data.facility1.purpose).click();
        await this.page.locator('#loanAmount').nth(1).click();
        await this.page.locator('#loanAmount').nth(1).fill(data.facility1.amount);
        await this.page.getByText('Select Type').first().click();
        await this.page.getByRole('option', { name: 'NORMAL' }).click();
        await this.page.getByRole('button', { name: 'Add', exact: true }).click();

        // Facility 2
        await this.page.getByRole('button', { name: '+ Add Product' }).click();
        await this.page.locator('#facilityCode').getByText('Select Type').click();
        await this.page.getByRole('option', { name: data.facility2.type }).click();
        await this.page.locator('#loanPurpose').getByText('Select Type').click();
        await this.page.getByText(data.facility2.purpose).click();
        await this.page.locator('#loanAmount').nth(1).click();
        await this.page.locator('#loanAmount').nth(1).fill(data.facility2.amount);
        await this.page.getByText('Select Tenure').click();
        await this.page.getByRole('option', { name: data.facility2.tenure }).click();
        await this.page.getByText('Select Type').first().click();
        await this.page.getByRole('option', { name: 'NORMAL' }).click();
        await this.page.getByRole('button', { name: 'Add', exact: true }).click();

        await this.page.locator('.mat-radio-outer-circle').first().click();
        await this.page.getByRole('button', { name: 'Next' }).click();
    }

    // ── Demographics and Address ──
    async addDemographicsAndAddress(data) {
        const demo = data.demographics;
        const addr = data.address;

        await this.page.getByRole('textbox').nth(1).click();
        await this.page.getByRole('textbox').nth(1).fill(demo.email);
        await this.page.getByRole('textbox').nth(1).press('Tab');

        await this.page.getByText('Select Industry').click();
        await this.page.getByRole('option', { name: demo.industry }).click();

        await this.page.getByRole('textbox', { name: 'dd-mm-yyyy' }).click();
        await this.page.getByRole('textbox', { name: 'dd-mm-yyyy' }).fill(demo.dateOfIncorporation);
        await this.page.getByRole('textbox', { name: 'dd-mm-yyyy' }).press('Tab');

        await this.page.locator('#subIndustry').getByRole('textbox').press('Tab');
        await this.page.getByText('Select Sub-Industry').click();
        await this.page.getByRole('option', { name: demo.subIndustry }).click();

        await this.page.getByRole('button', { name: '+ Add Permanent Address' }).click();
        await this.page.getByRole('button', { name: '+ Add New' }).click();
        await this.page.locator('#addressLine1').nth(1).fill(addr.line1);
        await this.page.locator('#addressLine2').nth(1).fill(addr.line2);
        await this.page.locator('#addressLine3').nth(1).fill(addr.line3);
        await this.page.locator('#addressLine4').nth(1).fill(addr.line4);
        await this.page.locator('#addressLine5').nth(1).fill(addr.line5);
        await this.page.getByRole('spinbutton').fill(addr.pincode);
        await this.page.getByRole('button', { name: 'Add', exact: true }).click();

        await this.page.getByText('Select Ocupancy Type').click();
        await this.page.getByRole('option', { name: addr.occupancy }).click();

        await this.page.getByRole('button', { name: 'No' }).click();

        // Simulating same for Communication
        await this.page.getByRole('button', { name: '+ Add Communication Address' }).click();
        await this.page.getByRole('button', { name: '+ Add New' }).click();
        await this.page.locator('#addressLine1').nth(1).fill(addr.line1);
        await this.page.locator('#addressLine2').nth(1).fill(addr.line2);
        await this.page.locator('#addressLine3').nth(1).fill(addr.line3);
        await this.page.locator('#addressLine4').nth(1).fill(addr.line4);
        await this.page.locator('#addressLine5').nth(1).fill(addr.line5);
        await this.page.getByRole('spinbutton').fill(addr.pincode);
        await this.page.getByRole('button', { name: 'Add', exact: true }).click();

        await this.page.getByText('Select Occupancy Type').click();
        await this.page.getByRole('option', { name: 'Rented' }).click();
    }

    // ── History and Business ──
    async addHistoryAndBusiness(data) {
        await this.page.getByRole('button', { name: '+ Add History and Business' }).click();
        await this.page.locator('textarea').click();
        await this.page.locator('textarea').fill(data.history.description);
        await this.page.getByRole('button', { name: 'Add', exact: true }).click();
        await this.page.getByRole('button', { name: 'Continue' }).click();
    }

    // ── Update Applicant Details ──
    async updateApplicantDetails(data) {
        const app = data.applicant;

        await this.page.locator('a').nth(5).click();
        await this.page.getByRole('button', { name: 'Update' }).click();
        await this.page.locator('div:nth-child(2) > .row > .col-lg-12 > .applicant-card > .edit').click();

        await this.page.locator('#firstName').nth(1).fill(app.firstName);
        await this.page.locator('#middleName').nth(1).fill(app.middleName);

        await this.page.locator('#emailId1 > div > #emailId1').fill(app.email);

        await this.page.getByText('Select relation').first().click();
        await this.page.getByRole('option', { name: 'APPLICANT' }).click();

        await this.page.getByText('Select Marital Status').click();
        await this.page.getByRole('option', { name: app.maritalStatus }).click();

        await this.page.locator('#spouseName').nth(1).fill(app.spouseName);
        await this.page.locator('#fatherName').nth(1).fill(app.fatherName);
        await this.page.locator('#motherName').nth(1).fill(app.motherName);

        await this.page.getByText('Select Religion').click();
        await this.page.getByRole('option', { name: app.religion }).click();
        await this.page.getByText('Select Caste').click();
        await this.page.getByRole('option', { name: app.caste, exact: true }).click();

        await this.page.getByText('Select Occupancy Type').click();
        await this.page.getByRole('option', { name: 'Leased' }).click();

        await this.page.getByRole('button', { name: 'No' }).first().click();
        await this.page.getByRole('button', { name: '+ Add Communication Address' }).click();
        await this.page.getByRole('heading', { name: /comm1|add1/ }).click();
        await this.page.getByText('Select Occupancy Type').click();
        await this.page.getByRole('option', { name: 'Leased' }).click();

        await this.page.getByText('Select Occupation').click();
        await this.page.getByRole('option', { name: app.occupation }).click();
        await this.page.locator('#employerName').nth(1).fill(app.employerName);
        await this.page.locator('#employmentDuration').nth(1).fill(app.employmentDuration);

        await this.page.getByText(app.orgType).click();
        await this.page.getByRole('button', { name: 'Update' }).first().click();
    }

    // ── Add Second Applicant (Entity or Individual) ──
    async addSecondApplicant(data) {
        if (!data.secondApplicant) return;
        const app2 = data.secondApplicant;

        await this.page.getByRole('button', { name: '+ Add Applicant' }).click();
        await this.page.getByLabel(app2.type).click();
        await this.page.getByPlaceholder('Mobile Number').fill(app2.mobileNumber);
        await this.page.getByRole('textbox', { name: 'PAN' }).first().fill(app2.panNumber);

        if (app2.type === 'Entity') {
            await this.page.locator('#businessName').nth(1).fill(app2.businessName);
            await this.page.locator('#industry').getByRole('textbox').click();
            await this.page.getByRole('option', { name: app2.industry }).click();
            await this.page.locator('#subIndustry').getByRole('textbox').click();
            await this.page.getByRole('option', { name: app2.subIndustry }).click();
            await this.page.getByRole('textbox', { name: 'dd-mm-yyyy' }).fill(app2.dateOfIncorporation);
            await this.page.locator('input[type="email"]').first().fill(app2.email);
            await this.page.getByText('Select relation').click();
            await this.page.getByRole('option', { name: app2.relation }).click();

            // Address logic simplified for execution demonstration
            await this.page.getByRole('button', { name: '+ Add Permanent Address' }).click();
            await this.page.getByRole('button', { name: '+ Add New' }).click();
            await this.page.locator('#addressLine1').nth(1).fill(app2.address.line1);
            await this.page.locator('#addressLine2').nth(1).fill(app2.address.line2);
            await this.page.getByRole('spinbutton').fill(app2.address.pincode);
            await this.page.getByRole('button', { name: 'Add', exact: true }).click();
            await this.page.getByText('Select Ocupancy Type').click();
            await this.page.getByRole('option', { name: app2.occupancy }).click();

            await this.page.getByText('Select Applicant Type').click();
            await this.page.getByRole('option', { name: app2.applicantType }).click();
        }
        await this.page.getByRole('button', { name: 'Add', exact: true }).click();
    }

    // ── Priority Sector Lending (PSL) ──
    async addPSL(data) {
        await this.page.getByRole('button', { name: '+ Add PSL' }).click();
        await this.page.locator('.mat-radio-outer-circle').first().click();

        await this.page.getByText('Select PSL Category').click();
        await this.page.getByRole('option', { name: data.psl.category }).click();

        await this.page.getByText('Select PSL Subcategory').click();
        await this.page.getByText(data.psl.subCategory).click();

        await this.page.getByRole('button', { name: 'Choose File' }).click();
        try { await this.page.getByRole('button', { name: 'Choose File' }).setInputFiles('sonarqube1.jpg'); } catch (e) { }

        await this.page.getByRole('button', { name: 'Add', exact: true }).click();
        await this.page.getByRole('button', { name: 'Continue' }).click();
    }

    // ── Documentation ──
    /**
     * @param {object} [docs]  Optional override; defaults to fixtures inside tests/fixtures/
     * @param {string} [docs.consentForm]       path to consent form file
     * @param {string} [docs.personalDocument]  path to personal document file
     */
    async uploadDocumentation(docs = {}) {
        const consentFile   = docs.consentForm      || 'tests/fixtures/consent_form.png';
        const personalFile  = docs.personalDocument || 'tests/fixtures/personal_doc.png';

        await this.page.getByRole('button', { name: 'Physical consent form' }).click();
        try {
            const consentInput = this.page.locator('input[type="file"]').first();
            await consentInput.setInputFiles(consentFile);
        } catch (e) {
            console.warn('[uploadDocumentation] Consent form upload skipped:', e.message);
        }

        await this.page.getByRole('button', { name: 'Personal Documents' }).click();
        try {
            // Target the file input inside the Personal Documents panel
            const personalInput = this.page.locator(
                '.mat-expansion-panel:has-text("Personal") input[type="file"], #file'
            ).first();
            await personalInput.setInputFiles(personalFile);
        } catch (e) {
            console.warn('[uploadDocumentation] Personal document upload skipped:', e.message);
        }
    }

    // ── Financial Info ──
    async addFinancialInfo(data) {
        await this.page.getByRole('heading', { name: 'Financial Info' }).click();

        await this.page.getByRole('button', { name: '-03-2026' }).click();
        await this.page.locator('#securedLoan').nth(1).fill(data.financials.securedLoan);
        await this.page.locator('#termLoan').nth(1).fill(data.financials.termLoan);
        await this.page.locator('#totalProjectedSales').nth(1).fill(data.financials.totalProjectedSales);
        await this.page.getByRole('button', { name: 'Yes' }).click();
        await this.page.getByRole('cell', { name: '₹' }).getByRole('textbox').fill('50,00,00');
        await this.page.locator('#caNumber').nth(1).fill(data.financials.caNumber);
        await this.page.locator('#caName').nth(1).fill(data.financials.caName);
        await this.page.locator('#udinNo').nth(1).fill(data.financials.udinNo);
        try { await this.page.getByRole('button', { name: 'Choose File' }).setInputFiles('Screenshot 2026-02-14 110521.png'); } catch (e) { }
        await this.page.getByRole('button', { name: 'Add' }).click();
    }

    // ── ITR & P&L ──
    async addITRAndPL(data) {
        if (!data.itrAndPL) return;

        await this.page.getByRole('heading', { name: 'ITR & P&L' }).click();
        await this.page.getByText('Upload manually').click();

        if (data.itrAndPL.uploadBalanceSheet) {
            try { await this.page.getByRole('button', { name: 'Choose File' }).first().setInputFiles('balance_sheet.pdf'); } catch (e) { }
        }

        if (data.itrAndPL.confirmCheckbox) {
            await this.page.getByText('I confirm to process uploaded documents').first().click();
            await this.page.getByRole('button', { name: 'Yes' }).click();
        }

        if (data.itrAndPL.uploadITR) {
            for (let i = 0; i < 3; i++) {
                try { await this.page.locator('#itrUpload').nth(i).setInputFiles('itr_doc.pdf'); } catch (e) { }
            }
            await this.page.getByText('I confirm to process uploaded documents').last().click();
        }
    }

    // ── Bank Statements ──
    async addBankStatements(data) {
        await this.page.getByRole('heading', { name: 'Bank Statements' }).click();
        try { await this.page.getByRole('button', { name: 'manual upload' }).click(); } catch (e) { }

        await this.page.getByText('Select Bank').click();
        await this.page.getByRole('option', { name: data.bankStatement.bankName }).click();

        await this.page.getByPlaceholder('Account Number').fill(data.bankStatement.accountNumber);

        if (data.bankStatement.existingOD === 'Yes') {
            await this.page.getByRole('button', { name: 'Yes' }).click();
            await this.page.getByPlaceholder('Limit').fill(data.bankStatement.limit);
        } else {
            await this.page.getByRole('button', { name: 'No' }).click();
        }

        await this.page.getByText('I hereby confirm that I have read and accepted terms and conditions for perfios.').click();
        await this.page.getByRole('button', { name: 'Login' }).click();

        try {
            await this.page.getByText('Upload Statement').click();
            await this.page.getByText('I confirm').click();
            await this.page.getByRole('button', { name: 'Upload your bank e-statements' }).click();
            await this.page.getByRole('button', { name: 'Return' }).click();
        } catch (e) {
            console.log("Upload flow might require different selectors or manual intervention.", e);
        }
    }

    // ── Take Over Details ──
    async addTakeOver(data) {
        await this.page.getByRole('heading', { name: 'Take Over' }).click();
        await this.page.getByRole('button', { name: '+ Add Takeover' }).click();
        await this.page.getByText('Select Type').first().click();
        await this.page.getByRole('option', { name: data.takeOver.type }).click();
        await this.page.locator('#ifscCode').getByRole('textbox').fill(data.takeOver.ifscCode);
        await this.page.locator('#ifscCode').getByRole('textbox').press('Tab');
        await this.page.locator('#bankAccountNumber').nth(1).fill(data.takeOver.bankAccountNumber);
        await this.page.locator('#loanAmount').nth(1).fill(data.takeOver.loanAmount);
        await this.page.locator('#udf17').nth(1).fill(data.takeOver.email);
        await this.page.getByRole('checkbox', { name: 'Sanction Letter waiver' }).check();
        try { await this.page.getByRole('button', { name: 'Choose File' }).setInputFiles('Screenshot 2026-02-14 182544.png'); } catch (e) { }
        await this.page.getByRole('button', { name: 'Add', exact: true }).click();

        if (data.takeOver2) {
            await this.page.getByRole('button', { name: '+ Add Takeover' }).click();
            await this.page.locator('mat-radio-button').filter({ hasText: data.takeOver2.from }).click();
            await this.page.getByText('Select NBFC Name').click();
            await this.page.getByRole('option', { name: data.takeOver2.nbfcName }).click();
            await this.page.getByText('Select City').click();
            await this.page.getByRole('option', { name: data.takeOver2.city }).click();
            await this.page.locator('#bankAccountNumber').nth(1).fill(data.takeOver2.bankAccountNumber);
            await this.page.locator('#loanAmount').nth(1).fill(data.takeOver2.loanAmount);
            await this.page.locator('input[type="email"]').last().fill(data.takeOver2.email);
            // Skipping file upload locally for second takeover mapping
            await this.page.getByRole('button', { name: 'Add', exact: true }).click();
        }
    }

    // ── GST Details ──
    async addGST(data) {
        await this.page.getByRole('heading', { name: 'GST' }).click();
        await this.page.getByRole('button', { name: '+ Add Monthly Sales' }).click();
        const gstData = data.gst.monthlySales;
        for (let i = 0; i < gstData.length; i++) {
            await this.page.locator(`#month${i}`).fill(gstData[i]);
        }
        try { await this.page.getByRole('button', { name: 'Choose File' }).setInputFiles('Screenshot 2026-02-15 124823.png'); } catch (e) { }
        await this.page.getByRole('button', { name: 'Add', exact: true }).click();
        await this.page.locator('#pr_id_5').getByRole('button').click();
    }

    // ── Security Details ──
    async addSecurity(data) {
        await this.page.getByRole('heading', { name: 'Security' }).click();
        await this.page.getByRole('button', { name: '+ Add Security' }).click();
        await this.page.getByText('Please select').click();
        await this.page.getByRole('option', { name: data.security.type }).click();
        await this.page.getByText('Please select').click();
        await this.page.getByRole('option', { name: data.security.year }).click();
        await this.page.getByRole('button', { name: '+ Add Address' }).click();
        await this.page.getByRole('button', { name: '+ Add New' }).click();
        await this.page.locator('#addressLine1').nth(1).fill(data.security.address.line1);
        await this.page.locator('#addressLine2').nth(1).fill(data.security.address.line2);
        await this.page.locator('#addressLine3').nth(1).fill(data.security.address.line3);
        await this.page.locator('#addressLine4').nth(1).fill(data.security.address.line4);
        await this.page.locator('#addressLine5').nth(1).fill(data.security.address.line5);
        await this.page.getByRole('spinbutton').fill(data.security.address.pincode);
        await this.page.locator('app-address-details').getByRole('button', { name: 'Add' }).first().click();

        await this.page.locator('#collateralMarketValue').nth(1).fill(data.security.collateralValue);
        await this.page.locator('input[type="undefined"]').fill(data.security.otherValue);
        await this.page.getByRole('button', { name: 'Add', exact: true }).click();
    }

    // ── Sourcing and Submit ──
    async addSourcingAndSubmit(data) {
        await this.page.locator('a').filter({ hasText: 'Actions' }).click();
        await this.page.locator('div').filter({ hasText: 'Sourcing Details' }).nth(5).click();

        await this.page.getByText('Select Branch').click();
        await this.page.locator('.p-dropdown-filter').fill(data.sourcing.branchSearch);
        await this.page.getByRole('option', { name: data.sourcing.branch }).click();

        await this.page.getByText('Select CCPA Code').click();
        await this.page.locator('.p-dropdown-filter').fill(data.sourcing.ccpaSearch);
        await this.page.getByRole('option', { name: data.sourcing.ccpa }).click();

        await this.page.getByRole('button', { name: 'Submit' }).click();
        await this.page.getByRole('img', { name: 'close icon' }).click();
    }
}
