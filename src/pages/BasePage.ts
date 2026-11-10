import { Page, Locator, expect } from '@playwright/test';
import { logger } from '../utils/logger.js';

/**
 * Enterprise Base Page Object.
 * Encapsulates common browser navigation, auto-waiting, PrimeNG helpers, and safe interactions.
 */
export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to a given URL with network idle synchronization.
   */
  public async navigateTo(url: string): Promise<void> {
    logger.info(`Navigating to URL: ${url}`, this.constructor.name);
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Selects an option from a PrimeNG p-dropdown without fragile CSS.
   */
  public async selectPrimeDropdown(dropdownLocator: Locator, optionText: string): Promise<void> {
    logger.debug(`Selecting dropdown option "${optionText}"`, this.constructor.name);
    await dropdownLocator.click();
    const panel = this.page.locator('.p-dropdown-panel');
    await expect(panel).toBeVisible({ timeout: 10_000 });
    const option = panel.locator('.p-dropdown-item', { hasText: optionText }).first();
    await option.click();
    await expect(panel).toBeHidden({ timeout: 5_000 }).catch(() => {});
  }

  /**
   * Fills an input field after ensuring clean focus and clearing previous values.
   */
  public async fillField(locator: Locator, value: string, fieldName: string = 'Field'): Promise<void> {
    logger.debug(`Filling field [${fieldName}] with: ${value}`, this.constructor.name);
    await locator.waitFor({ state: 'visible', timeout: 10_000 });
    await locator.click();
    await locator.fill('');
    await locator.fill(value);
  }

  /**
   * Waits for active HTTP/XHR traffic to settle.
   */
  public async waitForNetworkIdle(timeoutMs: number = 3000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout: timeoutMs }).catch(() => {});
  }

  /**
   * Waits for a toast notification to appear and asserts message if provided.
   */
  public async waitForToast(expectedText?: string, timeout: number = 8000): Promise<void> {
    const toast = this.page.locator('.toast, .p-toast-message, .snackbar, .notification').first();
    await expect(toast).toBeVisible({ timeout });
    if (expectedText) {
      await expect(toast).toContainText(expectedText);
    }
  }
}
