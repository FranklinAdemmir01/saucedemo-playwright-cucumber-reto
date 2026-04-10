import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { Logger } from '../utils/logger';

/**
 * Página de Checkout
 * Gestiona las interacciones del flujo de checkout
 * Siguiendo el Principio de Responsabilidad Única
 */
export class CheckoutPage extends BasePage {
  // Locators para el paso uno del checkout (información)
  private readonly checkoutInfoSelectors = {
    container: '.checkout_info_container',
    firstName: '#first-name',
    lastName: '#last-name',
    postalCode: '#postal-code',
    continueButton: '#continue',
    cancelButton: '#cancel',
    errorMessage: '[data-test="error"]',
  };

  // Locators para el paso dos del checkout (resumen)
  private readonly checkoutOverviewSelectors = {
    container: '.checkout_summary_container',
    cartList: '.cart_list',
    cartItem: '.cart_item',
    itemName: '.inventory_item_name',
    itemPrice: '.inventory_item_price',
    summarySubtotal: '.summary_subtotal_label',
    summaryTax: '.summary_tax_label',
    summaryTotal: '.summary_total_label',
    finishButton: '#finish',
    cancelButton: '#cancel',
  };

  // Locators para checkout completo
  private readonly checkoutCompleteSelectors = {
    container: '.checkout_complete_container',
    completeHeader: '.complete-header',
    completeText: '.complete-text',
    backHomeButton: '#back-to-products',
    ponyExpressImage: '.pony_express',
  };

  constructor(page: Page) {
    super(page, '');
  }

  /**
   * Esperar a que cargue la página de información del checkout
   */
  public async esperarPaginaInfoCheckout(): Promise<void> {
    await this.waitForElement(this.checkoutInfoSelectors.container);
    Logger.info('Página de información del checkout cargada');
  }

  /**
   * Llenar información del checkout
   */
  public async llenarInformacionCheckout(
    firstName: string,
    lastName: string,
    postalCode: string
  ): Promise<void> {
    Logger.info('Llenando información del checkout');
    await this.fill(this.checkoutInfoSelectors.firstName, firstName, 'First Name');
    await this.fill(this.checkoutInfoSelectors.lastName, lastName, 'Last Name');
    await this.fill(this.checkoutInfoSelectors.postalCode, postalCode, 'Postal Code');
    Logger.info('Información del checkout llenada exitosamente');
  }

  /**
   * Hacer clic en el botón continuar en la página de información
   */
  public async hacerClicContinuarEnInfo(): Promise<void> {
    await this.click(this.checkoutInfoSelectors.continueButton, 'Continue button');
    Logger.info('Avanzado a la página de resumen del checkout');
  }

  /**
   * Esperar a que cargue la página de resumen del checkout
   */
  public async esperarPaginaResumenCheckout(): Promise<void> {
    await this.waitForElement(this.checkoutOverviewSelectors.container);
    Logger.info('Página de resumen del checkout cargada');
  }

  /**
   * Obtener artículos del resumen del checkout
   */
  public async obtenerArticulosResumenCheckout(): Promise<string[]> {
    const items = await this.getElements(this.checkoutOverviewSelectors.itemName);
    const itemNames: string[] = [];

    for (const item of items) {
      const name = await item.textContent();
      if (name) itemNames.push(name);
    }

    Logger.debug(`El resumen del checkout contiene ${itemNames.length} artículos`);
    return itemNames;
  }

  /**
   * Hacer clic en el botón finalizar
   */
  public async hacerClicFinalizar(): Promise<void> {
    await this.click(this.checkoutOverviewSelectors.finishButton, 'Finish button');
    Logger.info('Checkout completado');
  }

  /**
   * Esperar a que cargue la página de checkout completo
   */
  public async esperarPaginaCheckoutCompleto(): Promise<void> {
    await this.waitForElement(this.checkoutCompleteSelectors.container);
    Logger.info('Página de checkout completo cargada');
  }

  /**
   * Obtener el encabezado de checkout completo
   */
  public async obtenerEncabezadoCheckoutCompleto(): Promise<string> {
    return await this.getText(this.checkoutCompleteSelectors.completeHeader);
  }

  /**
   * Obtener el mensaje de checkout completo
   */
  public async obtenerMensajeCheckoutCompleto(): Promise<string> {
    return await this.getText(this.checkoutCompleteSelectors.completeText);
  }

  /**
   * Verificar que el checkout está completo
   */
  public async estaCheckoutCompleto(): Promise<boolean> {
    const isVisible = await this.isVisible(this.checkoutCompleteSelectors.completeHeader);
    if (isVisible) {
      const header = await this.obtenerEncabezadoCheckoutCompleto();
      Logger.info(`Checkout completo con encabezado: ${header}`);
    }
    return isVisible;
  }
}
