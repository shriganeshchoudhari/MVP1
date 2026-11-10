export interface EnvironmentConfig {
  name: string;
  baseUrl: string;
  apiBaseUrl: string;
  loginUrl: string;
  dashboardUrl: string;
  defaultCredentials: {
    userId: string;
    password: string;
    otp: string;
  };
  businessDefaults: {
    group: string;
    segment: string;
  };
}

export const devConfig: EnvironmentConfig = {
  name: 'DEV',
  baseUrl: process.env.BASE_URL || 'https://smeclouat.hdfcbank.com',
  apiBaseUrl: process.env.API_BASE_URL || 'https://smeclouat.hdfcbank.com/api/v1',
  get loginUrl() {
    return `${this.baseUrl}/clouat/cloportal/#/rm-journey`;
  },
  get dashboardUrl() {
    return `${this.baseUrl}/clouat/cloportal/#/rm-journey-queue`;
  },
  defaultCredentials: {
    userId: process.env.USER_ID || process.env.RM_USER_ID || 'A10773',
    password: process.env.PASSWORD || process.env.RM_PASSWORD || 'laser123',
    otp: process.env.OTP || process.env.DEFAULT_OTP || '123456',
  },
  businessDefaults: {
    group: process.env.BUSINESS_GROUP || 'Working Capital',
    segment: process.env.BUSINESS_SEGMENT || 'BBG',
  },
};
