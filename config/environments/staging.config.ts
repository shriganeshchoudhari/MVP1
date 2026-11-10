import { EnvironmentConfig } from './dev.config.js';

export const stagingConfig: EnvironmentConfig = {
  name: 'STAGING',
  baseUrl: process.env.BASE_URL || 'https://smeclouat.hdfcbank.com/clouat6',
  apiBaseUrl: process.env.API_BASE_URL || 'https://smeclouat.hdfcbank.com/api/v1',
  get loginUrl() {
    return `${this.baseUrl}/cloportal/#/rm-journey`;
  },
  get dashboardUrl() {
    return `${this.baseUrl}/clouat6/cloportal/#/rm-journey-queue`;
  },
  defaultCredentials: {
    userId: process.env.RM_USER_ID || 'A10773',
    password: process.env.RM_PASSWORD || 'laser123',
    otp: process.env.DEFAULT_OTP || '123456',
  },
  businessDefaults: {
    group: process.env.BUSINESS_GROUP || 'Working Capital',
    segment: process.env.BUSINESS_SEGMENT || 'BBG',
  },
};
