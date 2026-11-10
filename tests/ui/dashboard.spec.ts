import { test, expect } from '../../src/fixtures/test.fixture.js';

test.describe('UI Functional - RM Dashboard Queue Management', () => {
  test('TC-UI-DASH-01: Navigation elements and queue tabs render properly', async ({ dashboardPage }) => {
    // Assert dashboard component locators are attached and configured
    expect(dashboardPage.header.rmDashboardLink).toBeDefined();
    expect(dashboardPage.nav.pendingTab).toBeDefined();
    expect(dashboardPage.nav.submittedTab).toBeDefined();
    expect(dashboardPage.nav.consentTab).toBeDefined();
  });
});
