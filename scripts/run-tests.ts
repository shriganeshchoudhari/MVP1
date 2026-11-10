import { execSync } from 'child_process';
import { logger } from '../src/utils/logger.js';

interface CliArgs {
  env?: string;
  suite?: string;
  headed?: boolean;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const result: CliArgs = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--env' && args[i + 1]) {
      result.env = args[++i];
    } else if (args[i] === '--suite' && args[i + 1]) {
      result.suite = args[++i];
    } else if (args[i] === '--headed') {
      result.headed = true;
    }
  }
  return result;
}

function main(): void {
  const { env = 'UAT', suite = 'smoke', headed = false } = parseArgs();
  logger.info(`Starting enterprise test runner [Env: ${env}, Suite: ${suite}, Headed: ${headed}]`, 'TestRunner');

  const headedFlag = headed ? '--headed' : '';
  const suiteDir = suite === 'all' ? 'tests' : `tests/${suite}`;
  const command = `npx playwright test ${suiteDir} --config config/playwright.config.ts ${headedFlag}`;

  try {
    execSync(command, {
      stdio: 'inherit',
      env: { ...process.env, ENV: env },
    });
    logger.info('Test execution completed successfully.', 'TestRunner');
  } catch (error) {
    logger.error('Test execution failed.', error, 'TestRunner');
    process.exit(1);
  }
}

main();
