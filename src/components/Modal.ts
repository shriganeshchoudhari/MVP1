import { Page, Locator } from '@playwright/test';

/**
 * Universal Dialog and Slide-in Panel Component.
 */
export class Modal {
  readonly page: Page;
  readonly modalContainer: Locator;
  readonly closeButton: Locator;
  readonly confirmButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modalContainer = page.locator('.modal, .p-dialog, .p-sidebar, [role="dialog"]').first();
    this.closeButton = page.locator('.p-dialog-header-close, .close, [aria-label="Close"], button:has-text("✕")').first();
    this.confirmButton = page.locator('button').filter({ hasText: /yes|confirm|proceed|ok/i }).first();
    this.cancelButton = page.locator('button').filter({ hasText: /no|cancel/i }).first();
  }

  public async isVisible(): Promise<boolean> {
    return await this.modalContainer.isVisible();
  }

  public async confirm(): Promise<void> {
    await this.confirmButton.click();
  }

  public async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  public async close(): Promise<void> {
    await this.closeButton.click();
  }
}
