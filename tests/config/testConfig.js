/**
 * Centralised test configuration.
 *
 * Values are read from environment variables (loaded by dotenv in playwright.config.js).
 * To switch environments, pass the right .env file:
 *
 *   UAT: npx playwright test --env-file .env.uat
 *   SIT: npx playwright test --env-file .env.sit
 *
 * Or set env vars directly:
 *   BASE_URL=https://... npx playwright test
 */
export const testConfig = {
    // ── Environment ──────────────────────────────────────────────────────────
    env: process.env.ENV || 'UAT',

    // ── URLs ─────────────────────────────────────────────────────────────────
    baseUrl: process.env.BASE_URL || 'https://smeclouat.hdfcbank.com',

    get loginUrl() {
        return `${this.baseUrl}/clouat/cloportal/#/rm-journey`;
    },
    get dashboardUrl() {
        return `${this.baseUrl}/clouat/cloportal/#/rm-journey-queue`;
    },

    // ── Login Credentials ─────────────────────────────────────────────────────
    credentials: {
        userId: process.env.USER_ID || 'A23429',
        password: process.env.PASSWORD || 'laser123',
        otp: process.env.OTP || '123456',
    },

    // ── Business Filters ─────────────────────────────────────────────────────
    business: {
        group: process.env.BUSINESS_GROUP || 'Working Capital',
        segment: process.env.BUSINESS_SEGMENT || 'BBG',
    },

    // ── Additional test users (override USER_ID one at a time via env var or
    //    change entries here) ──────────────────────────────────────────────────
    users: [
        process.env.USER_ID_1 || 'A10773',
        process.env.USER_ID_2 || 'A15183',
        process.env.USER_ID_3 || 'A23429',
    ],
};
