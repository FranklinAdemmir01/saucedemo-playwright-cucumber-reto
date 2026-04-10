import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, firefox, webkit } from '@playwright/test';
import { Logger } from '../utils/logger';
import { config } from '../config/env.config';
import { BrowserConfig } from '../config/browser.config';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';

/**
 * Custom World Class
 * Implements the World interface for Cucumber
 * Maintains state across step definitions
 * Following Dependency Injection principle
 */
export class CustomWorld extends World {
  public browser!: Browser;
  public context!: BrowserContext;
  public page!: Page;

  // Page Objects - Lazy initialization following Dependency Injection
  private _loginPage?: LoginPage;
  private _inventoryPage?: InventoryPage;
  private _cartPage?: CartPage;
  private _checkoutPage?: CheckoutPage;

  // Test context data
  public testData: Map<string, unknown> = new Map();

  constructor(options: IWorldOptions) {
    super(options);
  }

  /**
   * Initialize browser and context
   */
  public async init(): Promise<void> {
    try {
      Logger.info(`Initializing browser: ${config.browser}`);
      
      // Select browser based on configuration
      switch (config.browser) {
        case 'firefox':
          this.browser = await firefox.launch(BrowserConfig.getLaunchOptions());
          break;
        case 'webkit':
          this.browser = await webkit.launch(BrowserConfig.getLaunchOptions());
          break;
        case 'chromium':
        default:
          this.browser = await chromium.launch(BrowserConfig.getLaunchOptions());
      }

      this.context = await this.browser.newContext(BrowserConfig.getContextOptions());
      this.page = await this.context.newPage();

      // Set timeouts
      const timeouts = BrowserConfig.getTimeoutConfig();
      this.page.setDefaultTimeout(timeouts.defaultTimeout);
      this.page.setDefaultNavigationTimeout(timeouts.navigationTimeout);

      Logger.info('Browser initialized successfully');
    } catch (error) {
      Logger.error('Failed to initialize browser', { error });
      throw error;
    }
  }

  /**
   * Cleanup browser and context
   */
  public async cleanup(): Promise<void> {
    try {
      if (this.page) await this.page.close();
      if (this.context) {
        // Close context to finalize video recording
        await this.context.close();
      }
      if (this.browser) await this.browser.close();
      Logger.info('Browser cleanup completed');
    } catch (error) {
      Logger.error('Error during browser cleanup', { error });
    }
  }

  /**
   * Lazy getter for LoginPage
   */
  public get loginPage(): LoginPage {
    if (!this._loginPage) {
      this._loginPage = new LoginPage(this.page);
    }
    return this._loginPage;
  }

  /**
   * Lazy getter for InventoryPage
   */
  public get inventoryPage(): InventoryPage {
    if (!this._inventoryPage) {
      this._inventoryPage = new InventoryPage(this.page);
    }
    return this._inventoryPage;
  }

  /**
   * Lazy getter for CartPage
   */
  public get cartPage(): CartPage {
    if (!this._cartPage) {
      this._cartPage = new CartPage(this.page);
    }
    return this._cartPage;
  }

  /**
   * Lazy getter for CheckoutPage
   */
  public get checkoutPage(): CheckoutPage {
    if (!this._checkoutPage) {
      this._checkoutPage = new CheckoutPage(this.page);
    }
    return this._checkoutPage;
  }

  /**
   * Store data in test context
   */
  public setTestData(key: string, value: unknown): void {
    this.testData.set(key, value);
    Logger.debug(`Test data set: ${key}`);
  }

  /**
   * Retrieve data from test context
   */
  public getTestData<T>(key: string): T | undefined {
    return this.testData.get(key) as T | undefined;
  }

  /**
   * Clear test data
   */
  public clearTestData(): void {
    this.testData.clear();
    Logger.debug('Test data cleared');
  }
}

setWorldConstructor(CustomWorld);
