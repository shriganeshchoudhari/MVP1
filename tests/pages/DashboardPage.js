/**
 * Page Object Model for HDFC Xpress BizFinance RM Dashboard.
 * Covers: My Queue (Pending / Submitted / Consent tabs) and ARN search.
 */
export class DashboardPage {
    constructor(page) {
        this.page = page;

        // ── Top navigation ────────────────────────────────────────────────────
        this.arnSearchInput  = page.locator('input[placeholder*="ARN"], input[placeholder*="Search"], #arnSearch').first();
        this.createNewBtn    = page.locator('a, button').filter({ hasText: /create new/i }).first();
        this.logoutBtn       = page.locator('button, a').filter({ hasText: /logout/i }).first();

        // ── My Queue ──────────────────────────────────────────────────────────
        this.myQueueHeading  = page.locator('text=My Queue');
        this.pendingTab      = page.locator('.tab-cards, .tabs .tab, li').filter({ hasText: /pending/i }).first();
        this.submittedTab    = page.locator('.tab-cards, .tabs .tab, li').filter({ hasText: /submitted/i }).first();
        this.consentTab      = page.locator('.tab-cards, .tabs .tab, li').filter({ hasText: /consent/i }).first();

        // ── Consent grid ──────────────────────────────────────────────────────
        this.consentGrid     = page.locator('table, .grid, .p-datatable').first();
        this.consentRows     = page.locator('tr[role="row"]:not(:first-child), .p-datatable-row');
    }

    /** Wait for My Queue heading to confirm dashboard is loaded */
    async waitForDashboard(timeout = 20_000) {
        await this.myQueueHeading.waitFor({ state: 'visible', timeout });
    }

    /** Click the Consent tab */
    async clickConsentTab() {
        await this.consentTab.click();
        await this.page.waitForTimeout(500);
    }

    /** Click the Pending tab */
    async clickPendingTab() {
        await this.pendingTab.click();
        await this.page.waitForTimeout(500);
    }

    /** Click the Submitted tab */
    async clickSubmittedTab() {
        await this.submittedTab.click();
        await this.page.waitForTimeout(500);
    }

    /**
     * Search for an Application Reference Number (ARN).
     * @param {string} arn  e.g. 'ARN2024001234'
     */
    async searchARN(arn) {
        await this.arnSearchInput.click();
        await this.arnSearchInput.fill(arn);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(1000);
    }

    /**
     * Click a consent row matching a given mobile number.
     * @param {string} mobileNumber  10-digit borrower mobile
     */
    async selectConsentByMobile(mobileNumber) {
        await this.clickConsentTab();
        const row = this.page.locator(
            `tr:has-text("${mobileNumber}"), .p-datatable-row:has-text("${mobileNumber}")`
        ).first();
        await row.waitFor({ state: 'visible', timeout: 10_000 });
        await row.click();
    }

    /** Click "Create New" to start a fresh loan proposal */
    async clickCreateNew() {
        await this.createNewBtn.click();
    }

    /**
     * Verify the My Queue section contains all 3 required tabs.
     * @returns {Promise<{pending: boolean, submitted: boolean, consent: boolean}>}
     */
    async verifyQueueTabs() {
        return {
            pending:   await this.pendingTab.isVisible(),
            submitted: await this.submittedTab.isVisible(),
            consent:   await this.consentTab.isVisible(),
        };
    }
}
