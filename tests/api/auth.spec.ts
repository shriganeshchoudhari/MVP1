import { test, expect } from '../../src/fixtures/test.fixture.js';
import { activeEnv } from '../../config/environments/index.js';

test.describe('API - Authentication & Health Contract', () => {
  test('TC-API-01: Health check / base endpoint returns HTTP reachable status', async ({ apiClient }) => {
    const response = await apiClient.get(activeEnv.baseUrl);
    expect(response.status()).toBeLessThan(500);
  });
});
