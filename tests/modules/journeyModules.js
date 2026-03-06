import { expect } from '@playwright/test';

// ── Login and OTP ──
export async function loginAndOTP(page) {
    await page.goto('https://smeclouat.hdfcbank.com/clouat/cloportal/#/rm-journey');
    await page.locator('input[type="undefined"]').click();
    await page.locator('input[type="undefined"]').fill('A23429');
    await page.locator('input[type="undefined"]').press('Tab');
    await page.locator('input[type="password"]').fill('laser123');
    await page.locator('input[type="password"]').press('Tab');
    await page.locator('#selectedBusinessGroup').getByRole('textbox').press('Tab');
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.getByRole('textbox').nth(4).fill('1');
    await page.getByRole('textbox').nth(1).fill('2');
    await page.getByRole('textbox').nth(2).fill('3');
    await page.getByRole('textbox').nth(3).fill('4');
    await page.getByRole('textbox').nth(4).fill('5');
    await page.getByRole('textbox').nth(5).fill('6');
    await page.getByRole('button', { name: 'Submit OTP' }).click();
}

// ── Create Lead and Consent ──
export async function createLeadAndConsent(page) {
    await page.locator('a').filter({ hasText: 'Create New' }).click();
    await page.locator('#mobileNumber').click();
    await page.locator('#mobileNumber').fill('8990909090');
    // Mat radio button (Consent options / type)
    await page.locator('#mat-radio-3 > .mat-radio-label > .mat-radio-container > .mat-radio-outer-circle').click();

    await page.getByText('Select BusinessSegment').click();
    await page.getByRole('option', { name: 'BBG' }).click();

    await page.getByRole('button', { name: 'Get Customer Consent' }).click();
    await page.getByText('Please Ensure that a Signed').click(); // Acknowledge consent
    await page.getByRole('button', { name: 'Next' }).click();

    // Select customer from grid
    await page.locator('div:nth-child(3) > .d-flex > .tabs > .tab-cards').click();
    await page.getByRole('gridcell', { name: '205981' }).click();
}

// ── Customer Profile & Add Product ──
export async function selectCustomerAndAddProduct(page) {
    // Fill PAN or some identification textbox
    await page.getByRole('textbox').click();
    await page.getByRole('textbox').fill('AHMPA1234a');

    // Fill company name / zebra locator
    await page.locator('#zebra').nth(1).click();
    await page.locator('#zebra').nth(1).fill('Ganesh solutions');
    await page.locator('#zebra').nth(1).press('Tab');

    // Pincode
    await page.getByRole('spinbutton').fill('400033');
    await page.getByRole('button', { name: 'Next' }).click();

    await page.getByText('Skip this step').click();

    // Sector Selection
    await page.getByText('Select Sector').click();
    await page.getByRole('option', { name: 'Service' }).click();
    await page.getByText('Working Capital').click();
    await page.getByLabel('Working Capital').getByText('Working Capital').click();

    // -- Add First Product: Cash Credit
    await page.getByRole('button', { name: '+ Add Product' }).click();
    await page.locator('#facilityCode').getByText('Select Type').click();
    await page.getByText('Cash Credit').click();
    await page.locator('#loanPurpose').getByText('Select Type').click();
    await page.getByText('TERM LOAN FOR CAPITAL').click();
    await page.locator('#loanAmount').nth(1).click();
    await page.locator('#loanAmount').nth(1).fill('10,00,0000');
    await page.getByText('Select Type').first().click();
    await page.getByRole('option', { name: 'NORMAL' }).click();
    await page.getByRole('button', { name: 'Add', exact: true }).click();

    // -- Add Second Product: Term Loan
    await page.getByRole('button', { name: '+ Add Product' }).click();
    await page.locator('#facilityCode').getByText('Select Type').click();
    await page.getByRole('option', { name: 'Term Loan' }).click();
    await page.locator('#loanPurpose').getByText('Select Type').click();
    await page.getByText('TERM LOAN FOR WORKING CAPITAL').click();
    await page.locator('#loanAmount').nth(1).click();
    await page.locator('#loanAmount').nth(1).fill('2,00,0000');
    await page.getByText('Select Tenure').click();
    await page.getByRole('option', { name: '60' }).click();
    await page.getByText('Select Type').first().click();
    await page.getByRole('option', { name: 'NORMAL' }).click();
    await page.getByRole('button', { name: 'Add', exact: true }).click();

    // Radio button to select primary facility
    await page.locator('.mat-radio-outer-circle').first().click();
    await page.getByRole('button', { name: 'Next' }).click();
}

// ── Demographics and Address ──
export async function addDemographicsAndAddress(page) {
    // Email ID
    await page.getByRole('textbox').nth(1).click();
    await page.getByRole('textbox').nth(1).fill('ganeshsolutions@m.com');
    await page.getByRole('textbox').nth(1).press('Tab');

    // Industry
    await page.getByText('Select Industry').click();
    await page.getByRole('option', { name: 'EDUCATION SERVICE' }).click();

    // Date of Incorporation
    await page.getByRole('textbox', { name: 'dd-mm-yyyy' }).click();
    await page.getByRole('textbox', { name: 'dd-mm-yyyy' }).fill('02-02-2000');
    await page.getByRole('textbox', { name: 'dd-mm-yyyy' }).press('Tab');

    // Sub-Industry
    await page.locator('#subIndustry').getByRole('textbox').press('Tab');
    await page.getByText('Select Sub-Industry').click();
    await page.getByRole('option', { name: '-HIGHER EDUCATION' }).click();

    // Permanent Address
    await page.getByRole('button', { name: '+ Add Permanent Address' }).click();
    await page.getByRole('button', { name: '+ Add New' }).click();
    await page.locator('#addressLine1').nth(1).click();
    await page.locator('#addressLine1').nth(1).fill('add1');
    await page.locator('#addressLine1').nth(1).press('Tab');
    await page.locator('#addressLine2').nth(1).fill('add2');
    await page.locator('#addressLine2').nth(1).press('Tab');
    await page.locator('#addressLine3').nth(1).fill('add3');
    await page.locator('#addressLine3').nth(1).press('Tab');
    await page.locator('#addressLine4').nth(1).fill('local');
    await page.locator('#addressLine4').nth(1).press('Tab');
    await page.locator('#addressLine5').nth(1).fill('mark');
    await page.locator('#addressLine5').nth(1).press('Tab');
    await page.getByRole('spinbutton').fill('400033');
    await page.getByRole('button', { name: 'Add', exact: true }).click();

    // Occupancy Type (Permanent)
    await page.getByText('Select Ocupancy Type').click();
    await page.getByRole('option', { name: 'Leased' }).click();

    // Is Perm address same as Comm address? -> No
    await page.getByRole('button', { name: 'No' }).click();

    // Communication Address
    await page.getByRole('button', { name: '+ Add Communication Address' }).click();
    await page.getByRole('button', { name: '+ Add New' }).click();
    await page.locator('#addressLine1').nth(1).click();
    await page.locator('#addressLine1').nth(1).fill('comm1');
    await page.locator('#addressLine1').nth(1).press('Tab');
    await page.locator('#addressLine2').nth(1).fill('comm2');
    await page.locator('#addressLine2').nth(1).press('Tab');
    await page.locator('#addressLine3').nth(1).fill('comm3');
    await page.locator('#addressLine3').nth(1).press('Tab');
    await page.locator('#addressLine4').nth(1).fill('local');
    await page.locator('#addressLine4').nth(1).press('Tab');
    await page.locator('#addressLine5').nth(1).fill('mark');
    await page.locator('#addressLine5').nth(1).press('Tab');
    await page.getByRole('spinbutton').fill('400032');
    await page.getByRole('button', { name: 'Add', exact: true }).click();

    // Occupancy Type (Communication)
    await page.getByText('Select Occupancy Type').click();
    await page.getByRole('option', { name: 'Rented' }).click();
}

// ── History and Business ──
export async function addHistoryAndBusiness(page) {
    await page.getByRole('button', { name: '+ Add History and Business' }).click();
    await page.locator('textarea').click();
    await page.locator('textarea').fill('business background ');
    // Simulated repetitive typing in recording
    await page.locator('textarea').fill('business background business backgroundbusiness backgroundbusiness backgroundbusiness backgroundbusiness backgroundbusiness backgroundbusiness background');
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
}

// ── Update Applicant Details ──
export async function updateApplicantDetails(page) {
    // Click applicant tab / edit
    await page.locator('a').nth(5).click(); // Navigate to accurate tab
    await page.getByRole('button', { name: 'Update' }).click();
    await page.locator('div:nth-child(2) > .row > .col-lg-12 > .applicant-card > .edit').click();

    // Personal Details
    await page.locator('#firstName').nth(1).click();
    await page.locator('#firstName').nth(1).fill('RAMankant');
    await page.locator('#firstName').nth(1).press('Tab');

    await page.locator('#middleName').nth(1).click();
    await page.locator('#middleName').nth(1).fill('MANOHAR');
    await page.locator('#middleName').nth(1).press('Tab');
    await page.locator('#lastName').nth(1).press('Tab'); // Leaves empty if generated like this

    await page.locator('#gender input[type="text"]').press('Tab');
    await page.locator('.p-datepicker-trigger').first().press('Tab');

    // Email ID
    await page.locator('#emailId1 > div > #emailId1').fill('ram@m.com');
    await page.locator('#emailId1 > div > #emailId1').press('Tab');

    // Relationship / Marital / Family
    await page.getByText('Select relation').first().click();
    await page.getByRole('option', { name: 'APPLICANT' }).click();

    await page.getByText('Select Marital Status').click();
    await page.getByRole('option', { name: 'Married' }).click();

    await page.locator('#spouseName').nth(1).click();
    await page.locator('#spouseName').nth(1).fill('sita ram lohia');
    await page.locator('#spouseName').nth(1).press('Tab');

    await page.locator('#fatherName').nth(1).fill('sham kanha lohia');
    await page.locator('#fatherName').nth(1).press('Tab');

    await page.locator('#motherName').nth(1).fill('mina sham lohia');
    await page.locator('#motherName').nth(1).press('Tab');

    // Religion & Caste
    await page.getByText('Select Religion').click();
    await page.getByRole('option', { name: 'HINDU' }).click();
    await page.getByText('Select Caste').click();
    await page.getByRole('option', { name: 'SC', exact: true }).click();

    // Address Occupancy Type
    await page.getByText('Select Occupancy Type').click();
    await page.getByRole('option', { name: 'Leased' }).click();

    // Applicant Address
    await page.getByRole('button', { name: 'No' }).first().click();
    await page.getByRole('button', { name: '+ Add Communication Address' }).click();
    await page.getByRole('heading', { name: 'comm1,comm2,comm3,local,mark -' }).click(); // Selector based on summary address text
    await page.getByText('Select Occupancy Type').click();
    await page.getByRole('option', { name: 'Leased' }).click();

    // Occupation Details
    await page.getByText('Select Occupation').click();
    await page.getByRole('option', { name: 'Salaried' }).click();
    await page.locator('#employerName').nth(1).click();
    await page.locator('#employerName').nth(1).fill('MADAN insdustry');
    await page.locator('#employerName').nth(1).press('Tab');
    await page.locator('#employmentDuration').nth(1).fill('22');
    await page.locator('#employmentDuration').nth(1).press('Tab');

    // Organization type of employer
    await page.getByText('LIMITED LIABILITY PARTNERSHIP').click();
    await page.getByRole('button', { name: 'Update' }).click();
    await page.getByRole('button', { name: 'Update' }).click(); // Repeating update to confirm changes
    await page.getByRole('button', { name: 'Update' }).click();
}

// ── Priority Sector Lending (PSL) ──
export async function addPSL(page) {
    await page.getByRole('button', { name: '+ Add PSL' }).click();
    await page.locator('.mat-radio-outer-circle').first().click(); // Selects yes for PSL

    await page.getByText('Select PSL Category').click();
    await page.getByRole('option', { name: 'PSL SMALL SERVICE ENTERPRISES' }).click();

    await page.getByText('Select PSL Subcategory').click();
    await page.getByText('MANUFACTURING ENTP- SMALL').click();

    await page.getByRole('button', { name: 'Choose File' }).click();

    // The recorded script had 'sonarqube1.jpg'. You need this dummy file locally.
    try {
        await page.getByRole('button', { name: 'Choose File' }).setInputFiles('sonarqube1.jpg');
    } catch (e) {
        console.warn('Dummy file sonarqube1.jpg not found, skipping file upload step.');
    }

    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
}

// ── Documentation ──
export async function uploadDocumentation(page) {
    // Navigate strictly to documentation step
    // await page.goto('https://smeclouat.hdfcbank.com/clouat/cloportal/#/documentation');

    // Physical consent
    await page.getByRole('button', { name: 'Physical consent form' }).click();

    try {
        await page.getByRole('button', { name: 'Choose File' }).setInputFiles('Screenshot 2026-02-14 101241.png');
    } catch (e) {
        console.warn('Physical consent file not found');
    }

    // Personal Docs
    await page.getByRole('button', { name: 'Personal Documents' }).click();
    try {
        await page.locator('.mat-expansion-panel-body.ng-tns-c244-62 > div:nth-child(7) > .form-group > #file').setInputFiles('Screenshot 2026-02-14 101340.png');
    } catch (e) {
        console.warn('Personal Documents file not found');
    }
}

// ── Financial Info ──
export async function addFinancialInfo(page) {
    await page.getByRole('heading', { name: 'Financial Info' }).click();

    // 2026
    await page.getByRole('button', { name: '-03-2026' }).click();
    await page.locator('#securedLoan').nth(1).fill('2,00,0000');
    await page.locator('#termLoan').nth(1).fill('3,00,0000');
    await page.locator('#totalProjectedSales').nth(1).fill('4,00,0000');

    await page.getByRole('button', { name: 'Yes' }).click(); // CA Cert
    await page.getByRole('cell', { name: '₹' }).getByRole('textbox').fill('50,00,00'); // CA sales figure or similar

    await page.locator('#caNumber').nth(1).fill('CA1234');
    await page.locator('#caName').nth(1).fill('shrikant jadhav');
    await page.locator('#udinNo').nth(1).fill('UDIN89889');

    try { await page.getByRole('button', { name: 'Choose File' }).setInputFiles('Screenshot 2026-02-14 110521.png'); } catch (e) { }
    await page.getByRole('button', { name: 'Add' }).click();

    // 2025
    await page.getByRole('button', { name: '-03-2025' }).click();
    await page.getByText('Unaudited').click();
    await page.locator('#securedLoan').nth(1).fill('5,60,0000');
    await page.locator('#termLoan').nth(1).fill('34,0000');
    try { await page.getByRole('button', { name: 'Choose File' }).setInputFiles('Screenshot 2026-02-14 112145.png'); } catch (e) { }
    await page.getByRole('button', { name: 'Add' }).click();

    // 2024
    await page.getByRole('button', { name: '-03-2024' }).click();
    await page.locator('#securedLoan').nth(1).fill('6,00,0000');
    await page.locator('#termLoan').nth(1).fill('9,00,0000');
    try { await page.getByRole('button', { name: 'Choose File' }).setInputFiles('Screenshot 2026-02-14 182544.png'); } catch (e) { }
    await page.getByRole('button', { name: 'Add' }).click();

    // 2023
    await page.getByRole('button', { name: '-03-2023' }).click();
    await page.locator('#securedLoan').nth(1).fill('4,59,0000');
    await page.locator('#termLoan').nth(1).fill('3,40,0000');
    try { await page.getByRole('button', { name: 'Choose File' }).setInputFiles('Screenshot 2026-02-14 182610.png'); } catch (e) { }
    await page.getByRole('button', { name: 'Add' }).click();
}

// ── Take Over Details ──
export async function addTakeOver(page) {
    await page.getByRole('heading', { name: 'Take Over' }).click();

    // -- 1st Takeover
    await page.getByRole('button', { name: '+ Add Takeover' }).click();
    await page.getByText('Select Type').first().click();
    await page.getByRole('option', { name: 'Buyers Credit' }).click();
    await page.locator('#ifscCode').getByRole('textbox').fill('HDFC0000771');
    await page.locator('#ifscCode').getByRole('textbox').press('Tab'); // Trigger auto-fill bank
    await page.locator('#bankAccountNumber').nth(1).fill('LOAN909090090');
    await page.locator('#loanAmount').nth(1).fill('2,00,0000');
    await page.locator('#udf17').nth(1).fill('tk@hdfc.com');
    await page.getByRole('checkbox', { name: 'Sanction Letter waiver' }).check();
    try { await page.getByRole('button', { name: 'Choose File' }).setInputFiles('Screenshot 2026-02-14 182544.png'); } catch (e) { }
    await page.getByRole('button', { name: 'Add', exact: true }).click();

    // -- 2nd Takeover
    await page.getByRole('button', { name: '+ Add Takeover' }).click();
    await page.locator('#mat-radio-30 > .mat-radio-label > .mat-radio-container > .mat-radio-outer-circle').click(); // Non-Banking Fin Corp flag
    await page.getByText('Select Type').first().click();
    await page.getByRole('option', { name: 'Cash Credit' }).click();
    await page.locator('#bankAccountNumber').nth(1).fill('LOAN1234566');
    await page.locator('#loanAmount').nth(1).fill('40,0000');

    await page.locator('#nbfcName').getByText('Select Type').click();
    await page.getByText('AXIS FINANCE LIMITED').click();

    await page.getByText('Select Type').click(); // Facility Type or Status
    await page.getByRole('option', { name: 'ACCRA' }).click();

    await page.locator('#udf18').nth(1).fill('tk@nbfc.com');
    await page.getByRole('checkbox', { name: 'Sanction Letter waiver' }).check();
    try { await page.getByRole('button', { name: 'Choose File' }).setInputFiles('Screenshot 2026-02-15 123007.png'); } catch (e) { }
    await page.getByRole('button', { name: 'Add', exact: true }).click();
}

// ── GST Details ──
export async function addGST(page) {
    await page.getByRole('heading', { name: 'GST' }).click();
    await page.getByRole('button', { name: '+ Add Monthly Sales' }).click();

    const gstData = ['20,0000', '30,0000', '40,0000', '50,0000', '60,0000', '70,0000', '80,0000', '90,0000', '1,00,0000', '1,10,0000', '1,20,0000', '1,30,0000'];
    for (let i = 0; i < gstData.length; i++) {
        await page.locator(`#month${i}`).fill(gstData[i]);
    }

    try { await page.getByRole('button', { name: 'Choose File' }).setInputFiles('Screenshot 2026-02-15 124823.png'); } catch (e) { }
    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await page.locator('#pr_id_5').getByRole('button').click(); // Submit / Close modal
}

// ── Security Details ──
export async function addSecurity(page) {
    await page.getByRole('heading', { name: 'Security' }).click();
    await page.getByRole('button', { name: '+ Add Security' }).click();

    await page.getByText('Please select').click();
    await page.getByRole('option', { name: 'Plant & Machinery' }).click();

    await page.getByText('Please select').click(); // Select Year
    await page.getByRole('option', { name: '2013' }).click();

    await page.getByRole('button', { name: '+ Add Address' }).click();
    await page.getByRole('button', { name: '+ Add New' }).click();
    await page.locator('#addressLine1').nth(1).fill('add1');
    await page.locator('#addressLine2').nth(1).fill('add2');
    await page.locator('#addressLine3').nth(1).fill('add3');
    await page.locator('#addressLine4').nth(1).fill('local');
    await page.locator('#addressLine5').nth(1).fill('mark');
    await page.getByRole('spinbutton').fill('400001');

    await page.locator('app-address-details').getByRole('button', { name: 'Add' }).click();
    await page.locator('app-address-details').getByRole('button', { name: 'Add' }).click();

    // Collateral Values
    await page.locator('#collateralMarketValue').nth(1).fill('6,85,0000');
    await page.locator('input[type="undefined"]').fill('200000');

    await page.getByRole('button', { name: 'Add', exact: true }).click();

    // Government Backed Scheme
    await page.getByRole('button', { name: '+ Add Government Backed Scheme' }).click();
    await page.getByText('Credit Guarantee Fund Trust').first().click();
}

// ── Sourcing and Submit ──
export async function addSourcingAndSubmit(page) {
    await page.locator('a').filter({ hasText: 'Actions' }).click();
    await page.locator('div').filter({ hasText: 'Sourcing Details' }).nth(5).click();

    // Branch
    await page.getByText('Select Branch').click();
    await page.locator('.p-dropdown-filter').fill('jalandhar');
    await page.getByRole('option', { name: '14 - JALANDHAR' }).click();

    // CCPA
    await page.getByText('Select CCPA Code').click();
    await page.locator('.p-dropdown-filter').fill('EURE2348');
    await page.getByRole('option', { name: 'EURE2348 - Yashraj Lavaniyna' }).click();

    // Submit
    await page.getByRole('button', { name: 'Submit' }).click();

    // Close success icon / modal
    await page.getByRole('img', { name: 'close icon' }).click();
}
