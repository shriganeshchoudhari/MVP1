import { test, expect } from '@playwright/test';
import { testConfig } from './config/testConfig.js';

test('debug dropdowns HTML', async ({ page }) => {
    await page.goto(testConfig.loginUrl);
    await page.waitForLoadState('networkidle');

    await page.locator('input#userId').fill('A10773');
    await page.locator('input#userPassword').fill('laser123');
    await page.waitForTimeout(1000);

    const dropdowns = page.locator('p-dropdown');
    const count = await dropdowns.count();
    console.log("Total p-dropdown:", count);

    for (let i = 0; i < count; i++) {
        console.log(`\n--- Dropdown ${i} ---`);
        const html = await dropdowns.nth(i).evaluate(node => node.outerHTML);
        console.log(html.substring(0, 500));

        // Also let's check what parent element it has!
        const parentHtml = await dropdowns.nth(i).evaluate(node => node.parentElement.outerHTML);
        console.log("\nPARENT:", parentHtml.substring(0, 150));
    }
});
