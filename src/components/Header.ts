import { Page, Locator } from '@playwright/test';

/**
 * Top Application Header Component.
 * Contains user profile icon, assistance links, and logout trigger.
 */
export class Header {
  readonly page: Page;
  readonly logo: Locator;
  readonly rmDashboardLink: Locator;
  readonly assistLink: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.locator('img[alt*="HDFC"], .logo, text="XPRESS BIZFINANCE"').first();
    this.rmDashboardLink = page.getByRole('link', { name: /RM Dashboard/i }).first();
    this.assistLink = page.locator('a, button').filter({ hasText: /Assist/i }).first();
    this.logoutButton = page.getByRole('button', { name: /Logout/i }).first();
  }

  public async clickDashboard(): Promise<void> {
    await this.rmDashboardLink.click();
  }

  public async clickLogout(): Promise<void> {
    await this.logoutButton.click();
  }
}
