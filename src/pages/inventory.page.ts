import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { Logger } from '../utils/logger';

/**
 * Página de Inventario
 * Gestiona las interacciones con la página de productos/inventario
 * Siguiendo el Principio de Responsabilidad Única
 */
export class InventoryPage extends BasePage {
  // Locators
  private readonly selectors = {
    inventoryContainer: '.inventory_container',
    inventoryList: '.inventory_list',
    inventoryItem: '.inventory_item',
    itemName: '.inventory_item_name',
    itemDescription: '.inventory_item_desc',
    itemPrice: '.inventory_item_price',
    addToCartButton: '.btn_inventory',
    removeButton: '.btn_secondary',
    shoppingCartLink: '.shopping_cart_link',
    shoppingCartBadge: '.shopping_cart_badge',
    productSortContainer: '.product_sort_container',
    burgerMenu: '#react-burger-menu-btn',
    logoutLink: '#logout_sidebar_link',
    appLogo: '.app_logo',
  };

  constructor(page: Page) {
    super(page, '');
  }

  /**
   * Esperar a que cargue la página de inventario
   */
  public async esperarPaginaInventario(): Promise<void> {
    await this.waitForElement(this.selectors.inventoryContainer);
    Logger.info('Página de inventario cargada exitosamente');
  }

  /**
   * Verificar si la página de inventario está visible
   */
  public async estaPaginaInventarioVisible(): Promise<boolean> {
    return await this.isVisible(this.selectors.inventoryList);
  }

  /**
   * Obtener todos los nombres de productos
   */
  public async obtenerTodosNombresProductos(): Promise<string[]> {
    const products = await this.getElements(this.selectors.itemName);
    const names: string[] = [];

    for (const product of products) {
      const name = await product.textContent();
      if (name) names.push(name);
    }

    Logger.debug(`Se encontraron ${names.length} productos`);
    return names;
  }

  /**
   * Agregar producto al carrito por nombre
   */
  public async agregarProductoAlCarritoPorNombre(productName: string): Promise<void> {
    Logger.info(`Agregando producto al carrito: ${productName}`);
    const productId = productName.toLowerCase().replace(/\s+/g, '-');
    const buttonSelector = `[data-test="add-to-cart-${productId}"]`;

    await this.click(buttonSelector, `Add to cart button for ${productName}`);
    Logger.info(`Producto agregado al carrito: ${productName}`);
  }

  /**
   * Agregar el primer producto disponible al carrito
   */
  public async agregarPrimerProductoAlCarrito(): Promise<string> {
    const productNames = await this.obtenerTodosNombresProductos();
    const firstProduct = productNames[0];
    await this.agregarProductoAlCarritoPorNombre(firstProduct);
    return firstProduct;
  }

  /**
   * Obtener la cantidad de artículos en el carrito
   */
  public async obtenerCantidadArticulos(): Promise<number> {
    if (await this.isVisible(this.selectors.shoppingCartBadge)) {
      const badgeText = await this.getText(this.selectors.shoppingCartBadge);
      return parseInt(badgeText, 10);
    }
    return 0;
  }

  /**
   * Hacer clic en el carrito de compras
   */
  public async hacerClicCarritoCompras(): Promise<void> {
    await this.click(this.selectors.shoppingCartLink, 'Shopping cart link');
    Logger.info('Navegado al carrito de compras');
  }

  /**
   * Verificar si el producto fue agregado al carrito
   */
  public async estaProductoAgregadoAlCarrito(productName: string): Promise<boolean> {
    const productId = productName.toLowerCase().replace(/\s+/g, '-');
    const removeButtonSelector = `[data-test="remove-${productId}"]`;
    return await this.isVisible(removeButtonSelector);
  }
}
