import { test, expect } from '@playwright/test';
import { testConfig } from './config/testConfig.js';
import { LoginPage } from './pages/LoginPage.js';
import { OtpPage } from './pages/OtpPage.js';

test('debug OTP button', async ({ page }) => {
    // 1. Login
    const loginPage = new LoginPage(page);
    await loginPage.goto(testConfig.loginUrl);
    await loginPage.login({
        userId: testConfig.users.primary.userId,
        password: testConfig.users.primary.password,
        businessGroup: testConfig.business.group,
        businessSegment: testConfig.business.segment
    });

    // 2. Wait for OTP page
    const otpPage = new OtpPage(page);
    await expect(otpPage.otpBoxes.first()).toBeVisible({ timeout: 15000 });

    // 3. Fill OTP
    console.log("Filling OTP: 123456");
    await otpPage.fillOtp('123456');

    // 4. Debug button state
    await page.waitForTimeout(1000); // Wait for Angular validation

    const btn = otpPage.submitOtpBtn;
    console.log("Button HTML:", await btn.evaluate(node => node.outerHTML));
    console.log("Is button enabled?", await btn.isEnabled());

    const countFilled = await page.locator('.otp-input').evaluateAll(inputs =>
        inputs.filter(i => i.value !== '').length
    );
    console.log("Inner input values filled count:", countFilled);
});
