/**
 * Page Object Model for HDFC Xpress BizFinance Login Page.
 * The login URL is injected by the caller (from testConfig) so switching
 * environments (UAT → SIT → PROD) requires no changes here.
 */
export class LoginPage {
    constructor(page) {
        this.page = page;

        // Form fields — use `input#id` to skip the Angular <app-text-box> wrapper
        // which also carries the same id and triggers Playwright's strict-mode error.
        this.userIdInput = page.locator('input#userId');
        this.passwordInput = page.locator('input#userPassword');
        // Target the inner .p-dropdown that is actual rendered DOM element (the <p-dropdown> itself is just an Angular host)
        this.businessGroupDdl = page.locator('p-dropdown#selectedBusinessGroup .p-dropdown');
        this.businessSegDdl = page.locator('p-dropdown#selectedBusinessSegment .p-dropdown');
        this.loginButton = page.locator('button.primary-button', { hasText: 'Log In' });

        // Error / info messages
        this.errorMsg = page.locator('.error-message, .alert, .p-error').first();
    }

    /**
     * Navigate to the login page.
     * @param {string} url  Full login URL from testConfig.loginUrl
     */
    async goto(url) {
        await this.page.goto(url);
        await this.page.waitForLoadState('networkidle');
    }

    /** Fill User ID field */
    async fillUserId(userId) {
        await this.userIdInput.click();
        await this.userIdInput.fill('');
        await this.userIdInput.fill(userId);
    }

    /** Fill Password field */
    async fillPassword(password) {
        await this.passwordInput.click();
        await this.passwordInput.fill('');
        await this.passwordInput.fill(password);
    }

    /**
     * Select a value from a PrimeNG p-dropdown.
     * @param {import('@playwright/test').Locator} dropdownLocator
     * @param {string} optionText - visible text of the option to select
     */
    async selectDropdown(dropdownLocator, optionText) {
        // Open the dropdown
        await dropdownLocator.click();
        // Wait for options panel
        await this.page.waitForSelector('.p-dropdown-panel .p-dropdown-item', { state: 'visible' });
        // Click the matching option
        await this.page
            .locator('.p-dropdown-panel .p-dropdown-item', { hasText: optionText })
            .first()
            .click();
        // Wait for panel to close
        await this.page.waitForSelector('.p-dropdown-panel', { state: 'hidden' }).catch(() => { });
    }

    /** Select Business Group */
    async selectBusinessGroup(group) {
        await this.selectDropdown(this.businessGroupDdl, group);
    }

    /** Select Business Segment */
    async selectBusinessSegment(segment) {
        await this.selectDropdown(this.businessSegDdl, segment);
    }

    /** Click the Log In button */
    async clickLogin() {
        await this.loginButton.click();
    }

    /**
     * Perform a full login.
     * @param {object} credentials
     * @param {string} credentials.userId
     * @param {string} credentials.password
     * @param {string} credentials.businessGroup
     * @param {string} credentials.businessSegment
     */
    async login({ userId, password, businessGroup, businessSegment }) {
        await this.fillUserId(userId);
        await this.fillPassword(password);
        await this.selectBusinessGroup(businessGroup);
        await this.selectBusinessSegment(businessSegment);
        await this.clickLogin();
    }
}
