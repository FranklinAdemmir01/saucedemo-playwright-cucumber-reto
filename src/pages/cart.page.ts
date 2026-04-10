import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { Logger } from '../utils/logger';

/**
 * Page Object del Carrito
 * Gestiona las interacciones con el carrito de compras
 * Siguiendo el Principio de Responsabilidad Única
 */
export class CartPage extends BasePage {
  // Selectores
  private readonly selectors = {
    cartContainer: '.cart_contents_container',
    cartList: '.cart_list',
    cartItem: '.cart_item',
    itemName: '.inventory_item_name',
    itemPrice: '.inventory_item_price',
    itemQuantity: '.cart_quantity',
    removeButton: '.cart_button',
    continueShoppingButton: '#continue-shopping',
    checkoutButton: '#checkout',
    cartBadge: '.shopping_cart_badge',
  };

  constructor(page: Page) {
    super(page, '');
  }

  /**
   * Esperar a que la página del carrito cargue
   */
  public async esperarPaginaCarrito(): Promise<void> {
    await this.waitForElement(this.selectors.cartContainer);
    Logger.info('Página del carrito cargada exitosamente');
  }

  /**
   * Verificar que la página del carrito está visible
   */
  public async estaPaginaCarritoVisible(): Promise<boolean> {
    return await this.isVisible(this.selectors.cartContainer);
  }

  /**
   * Obtener todos los artículos en el carrito
   */
  public async obtenerArticulosCarrito(): Promise<string[]> {
    const items = await this.getElements(this.selectors.itemName);
    const itemNames: string[] = [];

    for (const item of items) {
      const name = await item.textContent();
      if (name) itemNames.push(name);
    }

    Logger.debug(`El carrito contiene ${itemNames.length} artículo(s)`);
    return itemNames;
  }

  /**
   * Obtener el número de artículos en el carrito
   */
  public async obtenerCantidadArticulos(): Promise<number> {
    return await this.getElementCount(this.selectors.cartItem);
  }

  /**
   * Verificar si un artículo está en el carrito
   */
  public async estaArticuloEnCarrito(itemName: string): Promise<boolean> {
    const cartItems = await this.obtenerArticulosCarrito();
    const isInCart = cartItems.includes(itemName);
    Logger.debug(`Artículo "${itemName}" en el carrito: ${isInCart}`);
    return isInCart;
  }

  /**
   * Eliminar un artículo del carrito por nombre
   */
  public async eliminarArticuloDelCarrito(itemName: string): Promise<void> {
    Logger.info(`Eliminando artículo del carrito: ${itemName}`);
    const productId = itemName.toLowerCase().replace(/\s+/g, '-');
    const buttonSelector = `[data-test="remove-${productId}"]`;

    await this.click(buttonSelector, `Botón eliminar para ${itemName}`);
    Logger.info(`Artículo eliminado del carrito: ${itemName}`);
  }

  /**
   * Hacer clic en el botón continuar comprando
   */
  public async hacerClicContinuarComprando(): Promise<void> {
    await this.click(this.selectors.continueShoppingButton, 'Botón continuar comprando');
    Logger.info('Navegando de vuelta al inventario');
  }

  /**
   * Hacer clic en el botón de checkout
   */
  public async hacerClicCheckout(): Promise<void> {
    await this.click(this.selectors.checkoutButton, 'Botón de checkout');
    Logger.info('Procediendo al checkout');
  }

  /**
   * Verificar si el carrito está vacío
   */
  public async estaCarritoVacio(): Promise<boolean> {
    const itemCount = await this.obtenerCantidadArticulos();
    return itemCount === 0;
  }
}
