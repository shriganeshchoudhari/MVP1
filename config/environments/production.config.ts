import { EnvironmentConfig } from './dev.config.js';

export const productionConfig: EnvironmentConfig = {
  name: 'PRODUCTION',
  baseUrl: process.env.BASE_URL || 'https://smeclo.hdfcbank.com',
  apiBaseUrl: process.env.API_BASE_URL || 'https://smeclo.hdfcbank.com/api/v1',
  get loginUrl() {
    return `${this.baseUrl}/clo/cloportal/#/rm-journey`;
  },
  get dashboardUrl() {
    return `${this.baseUrl}/clo/cloportal/#/rm-journey-queue`;
  },
  defaultCredentials: {
    userId: process.env.PROD_RM_USER_ID || '',
    password: process.env.PROD_RM_PASSWORD || '',
    otp: process.env.PROD_OTP || '',
  },
  businessDefaults: {
    group: 'Working Capital',
    segment: 'BBG',
  },
};
