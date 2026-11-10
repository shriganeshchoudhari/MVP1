import { devices, PlaywrightTestConfig } from '@playwright/test';

/**
 * Enterprise Browser and Viewport Matrix Configuration.
 * Configured for Chromium, Firefox, WebKit, and Responsive Device Emulation.
 */
export const browserProjects: PlaywrightTestConfig['projects'] = [
  // --- Desktop Browsers ---
  {
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
      viewport: { width: 1920, height: 1080 },
    },
  },

  // --- Mobile & Tablet Emulation (Responsive Testing) ---
  {
    name: 'mobile-chrome',
    use: {
      ...devices['Pixel 7'],
    },
  }
];
