import { test as base } from './base.fixture.js';
import { LoginPage } from '../pages/LoginPage.js';
import { activeEnv } from '../../config/environments/index.js';

export interface AuthFixtures {
  authenticatedPage: void;
}

export const authTest = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo(activeEnv.loginUrl);
    await loginPage.login({
      userId: activeEnv.defaultCredentials.userId,
      password: activeEnv.defaultCredentials.password,
      businessGroup: activeEnv.businessDefaults.group,
      businessSegment: activeEnv.businessDefaults.segment,
    });
    await use();
  },
});
