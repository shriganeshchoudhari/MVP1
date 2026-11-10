/**
 * Dynamic Test Data Factory.
 * Generates unique, non-colliding, syntactically valid test entities for parallel test execution.
 */
export class TestDataFactory {
  /**
   * Generates a syntactically valid Indian Business PAN:
   * 5 uppercase letters + 4 digits + 1 uppercase letter (e.g. ABCDE1234F).
   */
  public static generatePanNumber(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    let pan = '';
    for (let i = 0; i < 5; i++) {
      pan += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    for (let i = 0; i < 4; i++) {
      pan += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    pan += letters.charAt(Math.floor(Math.random() * letters.length));
    return pan;
  }

  /**
   * Generates a 10-digit Indian Mobile Number starting with 98 or 99.
   */
  public static generateMobileNumber(): string {
    const random8Digits = Math.floor(10000000 + Math.random() * 90000000).toString();
    return `98${random8Digits}`;
  }

  /**
   * Generates a realistic unique Company Name.
   */
  public static generateCompanyName(prefix: string = 'AutoEnterprise'): string {
    const uniqueSuffix = Date.now().toString().slice(-6);
    return `${prefix} Pvt Ltd ${uniqueSuffix}`;
  }

  /**
   * Generates a valid Udyam MSME Registration Number format:
   * UDYAM-MH-XX-XXXXXXX
   */
  public static generateUdyamNumber(): string {
    const randomCityCode = Math.floor(10 + Math.random() * 89).toString();
    const random7Digits = Math.floor(1000000 + Math.random() * 9000000).toString();
    return `UDYAM-MH-${randomCityCode}-${random7Digits}`;
  }

  /**
   * Generates an array of 12 mock monthly GST sales strings.
   */
  public static generateMonthlySales(baseAmount: number = 50000): string[] {
    return Array.from({ length: 12 }, (_, i) => (baseAmount + i * 5000).toString());
  }
}
