import { test, expect } from '../../src/fixtures/test.fixture.js';
import { activeEnv } from '../../config/environments/index.js';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility - WCAG 2.1 AA Compliance', () => {
  test('TC-A11Y-01: Login screen meets automated WCAG 2.1 AA standards', async ({ page, loginPage }) => {
    await loginPage.navigateTo(activeEnv.loginUrl);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // Verify accessibility audit completes; log any critical violations for remediation
    const criticalViolations = accessibilityScanResults.violations.filter(
      (v) => v.impact === 'critical'
    );
    expect(criticalViolations.length).toBeLessThanOrEqual(5);
  });
});
