import { Page, Locator } from '@playwright/test';
import { Logger } from '../utils/logger';

/**
 * Base Page Object
 * Provides common functionality for all page objects
 * Following DRY principle - centralizes reusable page methods
 */
export class BasePage {
  protected page: Page;
  protected url: string;

  constructor(page: Page, url: string = '') {
    this.page = page;
    this.url = url;
  }

  /**
   * Navigate to a specific URL
   */
  public async navigateTo(url: string): Promise<void> {
    Logger.info(`Navigating to: ${url}`);
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Navigate to page URL
   */
  public async navigate(): Promise<void> {
    if (!this.url) {
      throw new Error('Page URL not defined');
    }
    await this.navigateTo(this.url);
  }

  /**
   * Get current page URL
   */
  public async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Get page title
   */
  public async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Wait for element to be visible
   */
  public async waitForElement(selector: string | Locator, elementName?: string): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'element');
    
    Logger.debug(`Waiting for element: ${name}`);
    await locator.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Wait for element to be hidden
   */
  public async waitForElementToBeHidden(selector: string | Locator, elementName?: string): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'element');
    
    Logger.debug(`Waiting for element to be hidden: ${name}`);
    await locator.waitFor({ state: 'hidden', timeout: 10000 });
  }

  /**
   * Check if element is visible
   */
  public async isVisible(selector: string | Locator, elementName?: string): Promise<boolean> {
    try {
      const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
      const name = elementName || (typeof selector === 'string' ? selector : 'element');
      
      const isVisible = await locator.isVisible();
      Logger.debug(`Element ${name} visible: ${isVisible}`);
      return isVisible;
    } catch (error) {
      Logger.debug(`Element not visible: ${elementName || selector}`);
      return false;
    }
  }

  /**
   * Check if element is visible (alias for consistency with page classes)
   */
  public async isElementVisible(selector: string | Locator, elementName?: string): Promise<boolean> {
    return await this.isVisible(selector, elementName);
  }

  /**
   * Click on an element
   */
  public async click(selector: string | Locator, elementName?: string): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'element');
    
    Logger.debug(`Clicking element: ${name}`);
    await locator.click();
  }

  /**
   * Click on an element (alias for consistency with page classes)
   */
  public async clickElement(selector: string | Locator, elementName?: string): Promise<void> {
    await this.click(selector, elementName);
  }

  /**
   * Fill input field
   */
  public async fill(selector: string | Locator, text: string, elementName?: string): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'element');
    
    Logger.debug(`Filling element ${name} with text`);
    await locator.fill(text);
  }

  /**
   * Fill input field (alias for consistency with page classes)
   */
  public async fillInput(selector: string | Locator, text: string, elementName?: string): Promise<void> {
    await this.fill(selector, text, elementName);
  }

  /**
   * Clear input field
   */
  public async clear(selector: string | Locator, elementName?: string): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'element');
    
    Logger.debug(`Clearing element: ${name}`);
    await locator.clear();
  }

  /**
   * Type text into input field
   */
  public async type(selector: string | Locator, text: string, elementName?: string, delay?: number): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'element');
    
    Logger.debug(`Typing into element: ${name}`);
    await locator.type(text, { delay: delay || 50 });
  }

  /**
   * Get element text content
   */
  public async getText(selector: string | Locator, elementName?: string): Promise<string> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'element');
    
    Logger.debug(`Getting text from element: ${name}`);
    const text = await locator.textContent();
    return text || '';
  }

  /**
   * Get element text content (alias for consistency with page classes)
   */
  public async getElementText(selector: string | Locator, elementName?: string): Promise<string> {
    return await this.getText(selector, elementName);
  }

  /**
   * Get element inner text
   */
  public async getInnerText(selector: string | Locator, elementName?: string): Promise<string> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'element');
    
    Logger.debug(`Getting inner text from element: ${name}`);
    return await locator.innerText();
  }

  /**
   * Get input field value
   */
  public async getValue(selector: string | Locator, elementName?: string): Promise<string> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'element');
    
    Logger.debug(`Getting value from element: ${name}`);
    return await locator.inputValue();
  }

  /**
   * Get attribute value
   */
  public async getAttribute(selector: string | Locator, attributeName: string, elementName?: string): Promise<string | null> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'element');
    
    Logger.debug(`Getting attribute ${attributeName} from element: ${name}`);
    return await locator.getAttribute(attributeName);
  }

  /**
   * Get all elements matching selector
   */
  public async getElements(selector: string): Promise<Locator[]> {
    Logger.debug(`Getting all elements matching: ${selector}`);
    const locator = this.page.locator(selector);
    const count = await locator.count();
    const elements: Locator[] = [];
    
    for (let i = 0; i < count; i++) {
      elements.push(locator.nth(i));
    }
    
    return elements;
  }

  /**
   * Get count of elements matching selector
   */
  public async getElementCount(selector: string): Promise<number> {
    Logger.debug(`Counting elements matching: ${selector}`);
    return await this.page.locator(selector).count();
  }

  /**
   * Check if element is enabled
   */
  public async isEnabled(selector: string | Locator, elementName?: string): Promise<boolean> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'element');
    
    Logger.debug(`Checking if element is enabled: ${name}`);
    return await locator.isEnabled();
  }

  /**
   * Check if element is disabled
   */
  public async isDisabled(selector: string | Locator, elementName?: string): Promise<boolean> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'element');
    
    Logger.debug(`Checking if element is disabled: ${name}`);
    return await locator.isDisabled();
  }

  /**
   * Check if checkbox/radio is checked
   */
  public async isChecked(selector: string | Locator, elementName?: string): Promise<boolean> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'element');
    
    Logger.debug(`Checking if element is checked: ${name}`);
    return await locator.isChecked();
  }

  /**
   * Select option from dropdown by value
   */
  public async selectOption(selector: string | Locator, value: string, elementName?: string): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'element');
    
    Logger.debug(`Selecting option ${value} in element: ${name}`);
    await locator.selectOption(value);
  }

  /**
   * Take screenshot
   */
  public async takeScreenshot(name: string): Promise<Buffer> {
    Logger.info(`Taking screenshot: ${name}`);
    return await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }

  /**
   * Reload page
   */
  public async reload(): Promise<void> {
    Logger.info('Reloading page');
    await this.page.reload({ waitUntil: 'domcontentloaded' });
  }

  /**
   * Go back in browser history
   */
  public async goBack(): Promise<void> {
    Logger.info('Navigating back');
    await this.page.goBack();
  }

  /**
   * Go forward in browser history
   */
  public async goForward(): Promise<void> {
    Logger.info('Navigating forward');
    await this.page.goForward();
  }

  /**
   * Wait for navigation
   */
  public async waitForNavigation(): Promise<void> {
    Logger.debug('Waiting for navigation');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Wait for network to be idle
   */
  public async waitForNetworkIdle(): Promise<void> {
    Logger.debug('Waiting for network idle');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Hover over element
   */
  public async hover(selector: string | Locator, elementName?: string): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'element');
    
    Logger.debug(`Hovering over element: ${name}`);
    await locator.hover();
  }

  /**
   * Double click element
   */
  public async doubleClick(selector: string | Locator, elementName?: string): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'element');
    
    Logger.debug(`Double clicking element: ${name}`);
    await locator.dblclick();
  }

  /**
   * Press key
   */
  public async pressKey(key: string): Promise<void> {
    Logger.debug(`Pressing key: ${key}`);
    await this.page.keyboard.press(key);
  }

  /**
   * Scroll to element
   */
  public async scrollToElement(selector: string | Locator, elementName?: string): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'element');
    
    Logger.debug(`Scrolling to element: ${name}`);
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Wait for timeout
   */
  public async wait(milliseconds: number): Promise<void> {
    Logger.debug(`Waiting for ${milliseconds}ms`);
    await this.page.waitForTimeout(milliseconds);
  }

  /**
   * Execute JavaScript
   */
  public async executeScript<T>(script: string, ...args: any[]): Promise<T> {
    Logger.debug('Executing JavaScript');
    return await this.page.evaluate(script, ...args);
  }

  /**
   * Get current URL path
   */
  public async getUrlPath(): Promise<string> {
    const url = await this.getCurrentUrl();
    return new URL(url).pathname;
  }

  /**
   * Check if current URL contains text
   */
  public async urlContains(text: string): Promise<boolean> {
    const url = await this.getCurrentUrl();
    return url.includes(text);
  }

  /**
   * Wait for URL to contain text
   */
  public async waitForUrlToContain(text: string, timeout: number = 10000): Promise<void> {
    Logger.debug(`Waiting for URL to contain: ${text}`);
    await this.page.waitForURL(`**/*${text}*`, { timeout });
  }
}
