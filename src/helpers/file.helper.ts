import * as fs from 'fs';
import * as path from 'path';

/**
 * File management helper for document upload/download verification.
 */
export class FileHelper {
  /**
   * Ensures a dummy file exists on disk to be used for upload tests.
   */
  public static ensureDummyFile(filePath: string, sizeBytes: number = 1024): string {
    const resolvedPath = path.resolve(filePath);
    const dir = path.dirname(resolvedPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(resolvedPath)) {
      const buffer = Buffer.alloc(sizeBytes, 'A');
      fs.writeFileSync(resolvedPath, buffer);
    }
    return resolvedPath;
  }

  /**
   * Verifies file existence and non-zero size.
   */
  public static isFileValid(filePath: string): boolean {
    if (!fs.existsSync(filePath)) return false;
    const stats = fs.statSync(filePath);
    return stats.size > 0;
  }

  /**
   * Deletes a file safely if it exists.
   */
  public static removeFileIfExists(filePath: string): void {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
