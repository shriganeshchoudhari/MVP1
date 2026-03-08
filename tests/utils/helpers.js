/**
 * Shared utility helpers for HDFC Xpress BizFinance E2E tests.
 */

/**
 * Retry a click up to `retries` times with a short delay between attempts.
 * Useful for elements that animate into view or have intermittent attach issues.
 *
 * @param {import('@playwright/test').Locator} locator
 * @param {number} retries
 */
export async function retryClick(locator, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            await locator.click({ timeout: 5_000 });
            return;
        } catch (e) {
            if (i === retries - 1) throw e;
            await locator.page().waitForTimeout(600);
        }
    }
}

/**
 * Upload a file to a file input element.
 * Gracefully skips if the file doesn't exist (safe for CI fixture gaps).
 *
 * @param {import('@playwright/test').Locator} inputLocator  file input locator
 * @param {string} filePath                                  path relative to project root
 */
export async function uploadFile(inputLocator, filePath) {
    try {
        await inputLocator.setInputFiles(filePath);
    } catch (e) {
        console.warn(`[uploadFile] Skipped upload for "${filePath}": ${e.message}`);
    }
}

/**
 * Wait for a toast / success notification to appear.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string|RegExp} [messagePattern]  optional text to match
 * @param {number} [timeout]
 */
export async function waitForToast(page, messagePattern, timeout = 8_000) {
    const selector = '.toast, .p-toast-message, .snackbar, .notification';
    const toast = messagePattern
        ? page.locator(selector).filter({ hasText: messagePattern }).first()
        : page.locator(selector).first();
    await toast.waitFor({ state: 'visible', timeout });
}

/**
 * Select a value from a PrimeNG p-dropdown (reusable outside LoginPage).
 *
 * @param {import('@playwright/test').Page} page
 * @param {import('@playwright/test').Locator} dropdownLocator
 * @param {string} optionText
 */
export async function selectPrimeNgDropdown(page, dropdownLocator, optionText) {
    await dropdownLocator.click();
    await page.waitForSelector('.p-dropdown-panel .p-dropdown-item', { state: 'visible' });
    await page.locator('.p-dropdown-panel .p-dropdown-item', { hasText: optionText }).first().click();
    await page.waitForSelector('.p-dropdown-panel', { state: 'hidden' }).catch(() => {});
}

/**
 * Fill a PrimeNG date input (dd-mm-yyyy format).
 *
 * @param {import('@playwright/test').Locator} inputLocator
 * @param {string} dateStr  e.g. '02-02-2000'
 */
export async function fillDateInput(inputLocator, dateStr) {
    await inputLocator.click();
    await inputLocator.fill(dateStr);
    await inputLocator.press('Tab');
}

/**
 * Wait for any pending XHR / fetch calls to settle (simple 1-second debounce).
 * Wrap around slow API-dependent steps.
 *
 * @param {import('@playwright/test').Page} page
 * @param {number} [timeout]
 */
export async function waitForApiIdle(page, timeout = 3_000) {
    await page.waitForLoadState('networkidle', { timeout }).catch(() => {});
}
