import { expect, Locator } from '@playwright/test';
import { z } from 'zod';

/**
 * Domain-specific and web-first assertion helpers.
 */
export class AssertionHelper {
  /**
   * Asserts that a locator is visible within a custom timeout.
   */
  public static async assertVisible(locator: Locator, message?: string, timeout: number = 10000): Promise<void> {
    await expect(locator, message).toBeVisible({ timeout });
  }

  /**
   * Asserts that an input element has a specific value.
   */
  public static async assertValue(locator: Locator, expectedValue: string, message?: string): Promise<void> {
    await expect(locator, message).toHaveValue(expectedValue);
  }

  /**
   * Validates an API response against a Zod schema.
   */
  public static validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): T {
    const result = schema.safeParse(data);
    if (!result.success) {
      throw new Error(`Schema validation error: ${JSON.stringify(result.error.format(), null, 2)}`);
    }
    return result.data;
  }
}
