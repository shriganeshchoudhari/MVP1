import { test as baseTest } from './base.fixture.js';
import { LoginPage } from '../pages/LoginPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';
import { ApiClient } from '../api/clients/apiClient.js';
import { activeEnv } from '../../config/environments/index.js';

export interface PageFixtures {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  apiClient: ApiClient;
}

export const test = baseTest.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  apiClient: async ({ request }, use) => {
    await use(new ApiClient(request));
  },
});

export { expect } from '@playwright/test';
export { activeEnv };
