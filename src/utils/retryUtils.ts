import { logger } from './logger.js';

export interface RetryOptions {
  maxRetries?: number;
  delayMs?: number;
  backoffFactor?: number;
  description?: string;
}

/**
 * Executes an async action with exponential backoff retry logic.
 */
export async function withRetry<T>(
  action: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries = 3, delayMs = 1000, backoffFactor = 1.5, description = 'Operation' } = options;

  let currentDelay = delayMs;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await action();
    } catch (error) {
      if (attempt === maxRetries) {
        logger.error(`[withRetry] ${description} failed after ${maxRetries} attempts.`);
        throw error;
      }
      logger.warn(
        `[withRetry] ${description} attempt ${attempt} failed. Retrying in ${currentDelay}ms...`
      );
      await new Promise((resolve) => setTimeout(resolve, currentDelay));
      currentDelay *= backoffFactor;
    }
  }

  throw new Error(`[withRetry] Unexpected termination in ${description}`);
}

/**
 * Polls an async condition until it returns truthy or times out.
 */
export async function pollCondition(
  predicate: () => Promise<boolean>,
  timeoutMs: number = 15000,
  intervalMs: number = 500,
  description: string = 'Condition'
): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await predicate()) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  throw new Error(`[pollCondition] Timed out waiting for ${description} after ${timeoutMs}ms.`);
}
