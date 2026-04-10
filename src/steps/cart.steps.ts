import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { testData } from '../config/testdata.config';
import { Logger } from '../utils/logger';

/**
 * Cart Step Definitions
 * Implements steps for shopping cart scenarios
 */

// Background Steps
Given(
  'el usuario ha iniciado sesión con credenciales de usuario estándar',
  async function (this: CustomWorld) {
    Logger.info('Step: Login with standard user credentials');
    const credentials = testData.getUserCredentials('standard');
    await this.loginPage.ir();
    await this.loginPage.iniciarSesion(credentials.username, credentials.password);
    await this.inventoryPage.esperarPaginaInventario();
    this.setTestData('currentUser', credentials.username);
  }
);

Given('el usuario está en la página de inventario', async function (this: CustomWorld) {
  Logger.info('Step: Verify user is on inventory page');
  await this.inventoryPage.esperarPaginaInventario();
  const isDisplayed = await this.inventoryPage.estaPaginaInventarioVisible();
  expect(isDisplayed).toBeTruthy();
});

// When Steps
When(
  'el usuario agrega {string} al carrito',
  async function (this: CustomWorld, productName: string) {
    Logger.info(`Step: Add product to cart: ${productName}`);
    await this.inventoryPage.agregarProductoAlCarritoPorNombre(productName);
    this.setTestData('lastAddedProduct', productName);
  }
);

When('el usuario hace clic en el ícono del carrito de compras', async function (this: CustomWorld) {
  Logger.info('Step: Click on shopping cart icon');
  await this.inventoryPage.hacerClicCarritoCompras();
});

When('el usuario navega a la página del carrito', async function (this: CustomWorld) {
  Logger.info('Step: Navigate to cart page');
  await this.inventoryPage.hacerClicCarritoCompras();
  await this.cartPage.esperarPaginaCarrito();
});

// Then Steps
Then(
  'la insignia del carrito de compras debería mostrar {string}',
  async function (this: CustomWorld, expectedCount: string) {
    Logger.info(`Step: Verify cart badge displays: ${expectedCount}`);
    const actualCount = await this.inventoryPage.obtenerCantidadArticulos();
    expect(actualCount).toBe(parseInt(expectedCount, 10));
  }
);

Then(
  'el producto {string} debería mostrarse como agregado',
  async function (this: CustomWorld, productName: string) {
    Logger.info(`Step: Verify product shows as added: ${productName}`);
    const isAdded = await this.inventoryPage.estaProductoAgregadoAlCarrito(productName);
    expect(isAdded).toBeTruthy();
  }
);

Then('el usuario debería estar en la página del carrito', async function (this: CustomWorld) {
  Logger.info('Step: Verify user is on cart page');
  const isCartPageDisplayed = await this.cartPage.estaPaginaCarritoVisible();
  expect(isCartPageDisplayed).toBeTruthy();

  const currentUrl = await this.page.url();
  expect(currentUrl).toContain('/cart.html');
});

Then(
  'el carrito debería contener {int} artículo(s)',
  async function (this: CustomWorld, expectedCount: number) {
    Logger.info(`Step: Verify cart contains ${expectedCount} item(s)`);
    const actualCount = await this.cartPage.obtenerCantidadArticulos();
    expect(actualCount).toBe(expectedCount);
  }
);

Then(
  'el carrito debería mostrar {string}',
  async function (this: CustomWorld, productName: string) {
    Logger.info(`Step: Verify cart displays: ${productName}`);
    const isInCart = await this.cartPage.estaArticuloEnCarrito(productName);
    expect(isInCart).toBeTruthy();
  }
);

Then('the user should be on the inventory page', async function (this: CustomWorld) {
  Logger.info('Step: Verify user is on inventory page');
  await this.inventoryPage.esperarPaginaInventario();
  const isDisplayed = await this.inventoryPage.estaPaginaInventarioVisible();
  expect(isDisplayed).toBeTruthy();
  const currentUrl = await this.page.url();
  expect(currentUrl).toContain('/inventory.html');
});

Then(
  'the shopping cart badge should still display {string}',
  async function (this: CustomWorld, expectedCount: string) {
    Logger.info(`Step: Verify cart badge still displays: ${expectedCount}`);
    const actualCount = await this.inventoryPage.obtenerCantidadArticulos();
    expect(actualCount).toBe(parseInt(expectedCount, 10));
  }
);

Then(
  'the cart should only display {string}',
  async function (this: CustomWorld, productName: string) {
    Logger.info(`Step: Verify cart only displays: ${productName}`);
    const cartItems = await this.cartPage.obtenerArticulosCarrito();
    expect(cartItems.length).toBe(1);
    expect(cartItems[0]).toBe(productName);
  }
);
