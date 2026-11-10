/**
 * Enterprise Date & Calendar Manipulation Utilities.
 */
export class DateUtils {
  /**
   * Returns formatted date string DD-MM-YYYY (standard Indian banking format).
   */
  public static formatToDdMmYyyy(date: Date = new Date()): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  /**
   * Returns date string offset by specified days in DD-MM-YYYY format.
   */
  public static getOffsetDateDdMmYyyy(daysOffset: number): string {
    const target = new Date();
    target.setDate(target.getDate() + daysOffset);
    return this.formatToDdMmYyyy(target);
  }

  /**
   * Generates an array of last N financial years in descending order.
   * e.g., ["2025-2026", "2024-2025", "2023-2024"]
   */
  public static getPastFinancialYears(count: number = 3): string[] {
    const currentYear = new Date().getFullYear();
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      const startYear = currentYear - i - 1;
      const endYear = startYear + 1;
      result.push(`${startYear}-${endYear}`);
    }
    return result;
  }
}
