import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { Header } from '../components/Header.js';
import { Navigation } from '../components/Navigation.js';
import { logger } from '../utils/logger.js';

/**
 * Page Object Model for RM Dashboard (My Queue & ARN Search).
 */
export class DashboardPage extends BasePage {
  readonly header: Header;
  readonly nav: Navigation;
  readonly myQueueHeading: Locator;
  readonly arnSearchInput: Locator;
  readonly consentTable: Locator;
  readonly consentRows: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
    this.nav = new Navigation(page);
    this.myQueueHeading = page.locator('text=My Queue').first();
    this.arnSearchInput = page.locator('input[placeholder*="ARN"], input[placeholder*="Search"]').first();
    this.consentTable = page.locator('table, .grid, .p-datatable').first();
    this.consentRows = page.locator('tr[role="row"]:not(:first-child), .p-datatable-row');
  }

  public async waitForDashboard(timeoutMs: number = 20_000): Promise<void> {
    logger.info('Waiting for RM Dashboard to load...', 'DashboardPage');
    await expect(this.myQueueHeading).toBeVisible({ timeout: timeoutMs });
  }

  public async searchArn(arn: string): Promise<void> {
    logger.info(`Searching for ARN: ${arn}`, 'DashboardPage');
    await this.fillField(this.arnSearchInput, arn, 'ARN Search');
    await this.page.keyboard.press('Enter');
    await this.waitForNetworkIdle();
  }

  public async selectConsentRowByMobile(mobileNumber: string): Promise<void> {
    await this.nav.goToConsent();
    const row = this.page.locator(`tr:has-text("${mobileNumber}"), .p-datatable-row:has-text("${mobileNumber}")`).first();
    await expect(row).toBeVisible({ timeout: 10_000 });
    await row.click();
  }
}
