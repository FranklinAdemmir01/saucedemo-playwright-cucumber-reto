import dotenv from 'dotenv';

dotenv.config();

/**
 * Environment Configuration
 * Manages all environment variables and provides type-safe access
 * Following Single Responsibility Principle - handles only environment configuration
 */
export class EnvironmentConfig {
  private static instance: EnvironmentConfig;

  public readonly baseUrl: string;
  public readonly browser: 'chromium' | 'firefox' | 'webkit';
  public readonly headless: boolean;
  public readonly slowMo: number;
  public readonly timeout: number;
  public readonly screenshotOnFailure: boolean;
  public readonly videoOnFailure: boolean;
  public readonly reportTitle: string;
  public readonly reportName: string;

  private constructor() {
    this.baseUrl = process.env.BASE_URL || 'https://www.saucedemo.com';
    this.browser = this.validateBrowser(process.env.BROWSER || 'chromium');
    this.headless = process.env.HEADLESS === 'false';
    this.slowMo = parseInt(process.env.SLOW_MO || '0', 10);
    this.timeout = parseInt(process.env.TIMEOUT || '30000', 10);
    this.screenshotOnFailure = process.env.SCREENSHOT_ON_FAILURE !== 'false';
    this.videoOnFailure = process.env.VIDEO_ON_FAILURE !== 'false';
    this.reportTitle = process.env.REPORT_TITLE || 'SauceDemo Automation Test Report';
    this.reportName = process.env.REPORT_NAME || 'Playwright-Cucumber Testing Framework';
  }

  /**
   * Singleton pattern implementation
   */
  public static getInstance(): EnvironmentConfig {
    if (!EnvironmentConfig.instance) {
      EnvironmentConfig.instance = new EnvironmentConfig();
    }
    return EnvironmentConfig.instance;
  }

  /**
   * Validates and returns the browser type
   */
  private validateBrowser(browser: string): 'chromium' | 'firefox' | 'webkit' {
    const validBrowsers = ['chromium', 'firefox', 'webkit'];
    if (!validBrowsers.includes(browser)) {
      console.warn(`Invalid browser: ${browser}. Defaulting to chromium`);
      return 'chromium';
    }
    return browser as 'chromium' | 'firefox' | 'webkit';
  }
}

export const config = EnvironmentConfig.getInstance();
