/**
 * Page Object Model for HDFC Xpress BizFinance OTP Page
 * Appears after successful credential entry on the Login page.
 */
export class OtpPage {
    constructor(page) {
        this.page = page;

        // The OTP page contains 6 individual digit input boxes with class `.otp-input`
        this.otpInputs = page.locator('.otp-input');
        this.submitOtpBtn = page.locator('button.primary-button', { hasText: 'Submit OTP' });
        this.resendOtpLink = page.locator('span, a, button').filter({ hasText: /resend/i }).first();
        this.errorMsg = page.locator('.error-message, .alert, .p-error').first();
    }

    /** Wait for the OTP page to be visible */
    async waitForOtpPage() {
        await this.otpInputs.first().waitFor({ state: 'visible', timeout: 15_000 });
    }

    /** Fill OTP sequentially */
    async fillOtp(otpCode) {
        const count = await this.otpInputs.count();
        if (count !== 6) throw new Error(`Expected 6 OTP boxes, but found ${count}.`);

        // Sometimes ng-otp-input needs each box focused and typed into individually
        for (let i = 0; i < 6; i++) {
            const box = this.otpInputs.nth(i);
            await box.click(); // Focus the box
            await box.press(otpCode[i]); // Press the digit
        }

        // Wait for Angular validation to complete
        await this.page.waitForTimeout(500);
    }

    /** Click the Submit OTP button */
    async submitOtp() {
        await this.submitOtpBtn.click();
    }

    /**
     * Enter and submit the OTP in one step.
     * @param {string} otp  e.g. '123456'
     */
    async enterAndSubmitOtp(otp) {
        await this.waitForOtpPage();
        await this.enterOtp(otp);
        await this.submitOtp();
    }
}
