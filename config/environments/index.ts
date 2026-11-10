import { devConfig, EnvironmentConfig } from './dev.config.js';
import { qaConfig } from './qa.config.js';
import { stagingConfig } from './staging.config.js';
import { productionConfig } from './production.config.js';

export function getEnvironmentConfig(): EnvironmentConfig {
  const env = (process.env.ENV || 'QA').toUpperCase();

  switch (env) {
    case 'DEV':
      return devConfig;
    case 'QA':
    case 'UAT':
      return qaConfig;
    case 'STAGING':
    case 'STG':
      return stagingConfig;
    case 'PRODUCTION':
    case 'PROD':
      return productionConfig;
    default:
      console.warn(`[Config] Unrecognized ENV "${env}", falling back to QA configuration.`);
      return qaConfig;
  }
}

export const activeEnv = getEnvironmentConfig();
