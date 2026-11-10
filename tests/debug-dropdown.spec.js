import { test, expect } from '@playwright/test';
import { testConfig } from './config/testConfig.js';
import fs from 'fs';

test('debug dropdowns HTML', async ({ page }) => {
    await page.goto(testConfig.loginUrl);
    await page.waitForTimeout(5000); // Give it time to load the dropdowns

    // Dump entire body HTML to a file so we can inspect it safely
    const bodyHtml = await page.evaluate(() => document.body.innerHTML);
    fs.writeFileSync('page_dump.html', bodyHtml);
    console.log("Dumped page HTML to page_dump.html");
});
