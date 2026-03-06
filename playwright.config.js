// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Environment variables are loaded BEFORE playwright via:
 *
 *   Option A – Node 20+ built-in flag (recommended):
 *     node --env-file .env.uat node_modules/.bin/playwright test
 *
 *   Option B – npm scripts defined in package.json (simplest):
 *     npm run test:uat   →  runs with .env.uat
 *     npm run test:sit   →  runs with .env.sit
 *
 *   Option C – inline cross-env:
 *     cross-env BASE_URL=https://... npx playwright test
 *
 * No dotenv import needed here — all values come from process.env.
 */

const BASE_URL = process.env.BASE_URL || 'https://smeclouat.hdfcbank.com';

/** @see https://playwright.dev/docs/test-configuration */
export default defineConfig({
  testDir: './tests',

  /* Run tests sequentially — avoids concurrent sessions on the portal */
  fullyParallel: false,
  workers: 1,

  /* Fail build on CI if test.only is accidentally left in */
  forbidOnly: !!process.env.CI,

  /* Retry once locally, twice on CI */
  retries: process.env.CI ? 2 : 1,

  /* HTML report */
  reporter: 'html',

  /* ── Shared browser options ─────────────────────────────────────── */
  use: {
    baseURL: BASE_URL,

    /* Show browser window during runs (set HEADLESS=true to disable) */
    headless: process.env.HEADLESS === 'true',

    /* Per-action timeout */
    actionTimeout: 15_000,

    /* Always collect traces for debugging */
    trace: 'on',

    /* Screenshot on failures */
    screenshot: 'only-on-failure',

    /* Video on failures */
    video: 'retain-on-failure',
  },

  /* Global test timeout – 60 s covers login + OTP round-trip */
  timeout: 60_000,

  /* ── Browser projects ───────────────────────────────────────────── */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // Uncomment to run on other browsers:
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit',  use: { ...devices['Desktop Safari']  } },
    // { name: 'Mobile Chrome', use: { ...devices['Pixel 5']   } },
    // { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
});
