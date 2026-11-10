import { test, expect, activeEnv } from '../../src/fixtures/test.fixture.js';

test.describe('Smoke - RM Portal Authentication', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateTo(activeEnv.loginUrl);
  });

  test('TC-SMOKE-01: Login page elements render with accessible controls', async ({ loginPage }) => {
    await expect(loginPage.userIdInput).toBeVisible({ timeout: 15_000 });
    await expect(loginPage.passwordInput).toBeVisible({ timeout: 15_000 });
    await expect(loginPage.loginButton).toBeVisible({ timeout: 15_000 });
  });

  test('TC-SMOKE-02: Form fields accept input and update values', async ({ loginPage }) => {
    await loginPage.fillUserId('A10773');
    await expect(loginPage.userIdInput).toHaveValue('A10773');

    await loginPage.fillPassword('TestSecret123');
    await expect(loginPage.passwordInput).toHaveValue('TestSecret123');
  });

  test('TC-SMOKE-03: Empty credentials validation prevents form submission', async ({ loginPage, page }) => {
    await expect(loginPage.loginButton).toBeVisible({ timeout: 15_000 });
    await loginPage.clickLogin();
    await expect(page).toHaveURL(/.*rm-journey.*/);
  });
});
