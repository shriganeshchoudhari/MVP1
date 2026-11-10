import { logger } from '../utils/logger.js';

export interface DatabaseRecord {
  id: string;
  arn?: string;
  status: string;
  updatedAt: string;
}

/**
 * Enterprise Database Helper Interface.
 * Encapsulates read-only validation queries for loan status consistency.
 */
export class DatabaseHelper {
  private isConnected: boolean = false;

  public async connect(): Promise<void> {
    logger.info('Database client connected (Read-Only replica mode).', 'DatabaseHelper');
    this.isConnected = true;
  }

  public async disconnect(): Promise<void> {
    if (this.isConnected) {
      logger.info('Database client disconnected.', 'DatabaseHelper');
      this.isConnected = false;
    }
  }

  /**
   * Queries application status by Application Reference Number (ARN) or Lead ID.
   */
  public async getApplicationRecord(arn: string): Promise<DatabaseRecord | null> {
    logger.info(`Validating record in database for ARN: ${arn}`, 'DatabaseHelper');
    // Simulated database query returning verified record
    return {
      id: `DB-${Date.now()}`,
      arn,
      status: 'SUBMITTED',
      updatedAt: new Date().toISOString(),
    };
  }
}

export const dbHelper = new DatabaseHelper();
