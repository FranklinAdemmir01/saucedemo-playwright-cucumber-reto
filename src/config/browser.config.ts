import { LaunchOptions, BrowserContextOptions } from '@playwright/test';
import { config } from './environments';

/**
 * Browser Configuration
 * Centralizes browser and context configuration
 * Now uses centralized environment configuration
 */
export class BrowserConfig {
  /**
   * Returns browser launch options
   */
  public static getLaunchOptions(): LaunchOptions {
    return {
      headless: config.headless,
      slowMo: config.browser.slowMo,
      args: [
        '--start-maximized',
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage',
      ],
      timeout: config.timeout.default,
    };
  }

  /**
   * Returns browser context options
   */
  public static getContextOptions(): BrowserContextOptions {
    return {
      viewport: config.browser.viewport,
      ignoreHTTPSErrors: config.browser.ignoreHTTPSErrors,
      acceptDownloads: true,
      recordVideo: config.features.enableVideos ? {
        dir: 'reports/videos',
        size: { width: 1920, height: 1080 },
      } : undefined,
      permissions: ['geolocation', 'notifications'],
      timezoneId: 'America/New_York',
      locale: 'en-US',
    };
  }

  /**
   * Returns timeout configuration
   */
  public static getTimeoutConfig() {
    return {
      defaultTimeout: config.timeout.default,
      navigationTimeout: config.timeout.long,
      shortTimeout: config.timeout.short,
      longTimeout: config.timeout.long,
    };
  }

  /**
   * Get browser type from environment
   */
  public static getBrowserType(): 'chromium' | 'firefox' | 'webkit' {
    const browserType = process.env.BROWSER || 'chromium';
    if (!['chromium', 'firefox', 'webkit'].includes(browserType)) {
      throw new Error(`Invalid browser type: ${browserType}`);
    }
    return browserType as 'chromium' | 'firefox' | 'webkit';
  }
}

