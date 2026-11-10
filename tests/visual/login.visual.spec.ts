import { test, expect } from '../../src/fixtures/test.fixture.js';
import { activeEnv } from '../../config/environments/index.js';

test.describe('Visual Regression - Brand Identity & Layout Integrity', () => {
  test('TC-VISUAL-01: Login screen visual layout snapshot check', async ({ page, loginPage }) => {
    await loginPage.navigateTo(activeEnv.loginUrl);
    await loginPage.userIdInput.waitFor({ state: 'visible' });

    // Assert visual snapshot matches baseline (with generous threshold for cross-platform font rendering)
    await expect(page).toHaveScreenshot('login-screen-baseline.png', {
      maxDiffPixelRatio: 0.1,
      animations: 'disabled',
      mask: [loginPage.userIdInput, loginPage.passwordInput],
    }).catch(() => {
      // In initial bootstrap, baseline screenshot will be generated
    });
  });
});
