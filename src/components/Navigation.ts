import { Page, Locator } from '@playwright/test';

/**
 * Navigation Component.
 * Encapsulates Queue tabs and wizard breadcrumb links.
 */
export class Navigation {
  readonly page: Page;
  readonly pendingTab: Locator;
  readonly submittedTab: Locator;
  readonly rejectedTab: Locator;
  readonly consentTab: Locator;
  readonly createNewBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pendingTab = page.locator('.tab-cards, .tabs .tab, li').filter({ hasText: /pending/i }).first();
    this.submittedTab = page.locator('.tab-cards, .tabs .tab, li').filter({ hasText: /submitted/i }).first();
    this.rejectedTab = page.locator('.tab-cards, .tabs .tab, li').filter({ hasText: /rejected/i }).first();
    this.consentTab = page.locator('.tab-cards, .tabs .tab, li').filter({ hasText: /consent/i }).first();
    this.createNewBtn = page.locator('a, button').filter({ hasText: /create new/i }).first();
  }

  public async goToPending(): Promise<void> {
    await this.pendingTab.click();
  }

  public async goToSubmitted(): Promise<void> {
    await this.submittedTab.click();
  }

  public async goToConsent(): Promise<void> {
    await this.consentTab.click();
  }

  public async clickCreateNew(): Promise<void> {
    await this.createNewBtn.click();
  }
}
