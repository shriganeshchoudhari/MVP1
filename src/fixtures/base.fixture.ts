import { test as baseTest } from '@playwright/test';
import { logger } from '../utils/logger.js';

export interface BaseTestFixtures {
  logTestStart: void;
}

export const test = baseTest.extend<BaseTestFixtures>({
  logTestStart: [
    async ({}, use, testInfo) => {
      logger.info(`Starting Test: [${testInfo.title}]`, 'TestRunner');
      await use();
      logger.info(`Finished Test: [${testInfo.title}] with status: [${testInfo.status}]`, 'TestRunner');
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
