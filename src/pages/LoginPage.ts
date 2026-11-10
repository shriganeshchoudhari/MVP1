import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { UserCredentials } from '../types/user.types.js';
import { logger } from '../utils/logger.js';

/**
 * Page Object Model for HDFC Xpress BizFinance RM Login Screen.
 */
export class LoginPage extends BasePage {
  readonly userIdInput: Locator;
  readonly passwordInput: Locator;
  readonly businessGroupDropdown: Locator;
  readonly businessSegmentDropdown: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    // Angular app-text-box wrappers contain native inputs
    this.userIdInput = page.locator('input#userId');
    this.passwordInput = page.locator('input#userPassword');
    this.businessGroupDropdown = page.locator('p-dropdown#selectedBusinessGroup .p-dropdown');
    this.businessSegmentDropdown = page.locator('p-dropdown#selectedBusinessSegment .p-dropdown');
    this.loginButton = page.getByRole('button', { name: /Log In/i });
    this.errorMessage = page.locator('.error-message, .alert, .p-error').first();
  }

  public async fillUserId(userId: string): Promise<void> {
    await this.fillField(this.userIdInput, userId, 'RM ID');
  }

  public async fillPassword(password: string): Promise<void> {
    await this.fillField(this.passwordInput, password, 'Password');
  }

  public async selectBusinessGroup(groupName: string): Promise<void> {
    await this.selectPrimeDropdown(this.businessGroupDropdown, groupName);
  }

  public async selectBusinessSegment(segmentName: string): Promise<void> {
    await this.selectPrimeDropdown(this.businessSegmentDropdown, segmentName);
  }

  public async clickLogin(): Promise<void> {
    logger.info('Submitting login credentials', 'LoginPage');
    await this.loginButton.click();
  }

  /**
   * Executes full login workflow up to OTP trigger.
   */
  public async login(credentials: UserCredentials): Promise<void> {
    await this.fillUserId(credentials.userId);
    await this.fillPassword(credentials.password);

    // Dynamic dropdowns render upon filling credentials
    await expect(this.businessGroupDropdown).toBeVisible({ timeout: 15_000 });
    if (credentials.businessGroup) {
      await this.selectBusinessGroup(credentials.businessGroup);
    }
    if (credentials.businessSegment) {
      await this.selectBusinessSegment(credentials.businessSegment);
    }

    await this.clickLogin();
  }
}
