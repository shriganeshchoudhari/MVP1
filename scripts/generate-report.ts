import { execSync } from 'child_process';
import { logger } from '../src/utils/logger.js';

function generateReports(): void {
  logger.info('Generating consolidated test execution reports...', 'ReportGenerator');

  try {
    logger.info('Checking for Allure CLI...', 'ReportGenerator');
    execSync('npx allure generate allure-results --clean -o allure-report', {
      stdio: 'inherit',
    });
    logger.info('Allure report generated at: allure-report/index.html', 'ReportGenerator');
  } catch (error) {
    logger.warn('Allure CLI not globally installed or report step skipped. Playwright HTML report is available at playwright-report/index.html');
  }
}

generateReports();
