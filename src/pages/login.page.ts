import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { Logger } from '../utils/logger';
import { config } from '../config/env.config';
import { UserCredentials } from '../config/testdata.config';

/**
 * Página de Login
 * Encapsula todas las interacciones de la página de inicio de sesión
 * Siguiendo el Principio de Responsabilidad Única - maneja solo operaciones de la página de login
 */
export class LoginPage extends BasePage {
  // Selectores
  private readonly selectors = {
    usernameInput: '#user-name',
    passwordInput: '#password',
    loginButton: '#login-button',
    errorMessage: '[data-test="error"]',
  };

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navegar a la página de login
   */
  public async ir(): Promise<void> {
    Logger.info('Navegando a la página de login');
    await this.navigateTo(config.baseUrl);
  }

  /**
   * Ingresar nombre de usuario en el formulario de login
   */
  public async ingresarNombreUsuario(username: string): Promise<void> {
    Logger.info(`Ingresando nombre de usuario: ${username}`);
    await this.fill(this.selectors.usernameInput, username, 'Username');
  }

  /**
   * Ingresar contraseña
   */
  public async ingresarContrasena(password: string): Promise<void> {
    Logger.info('Ingresando contraseña');
    await this.fill(this.selectors.passwordInput, password, 'Password');
  }

  /**
   * Hacer clic en el botón de login
   */
  public async hacerClicBotonLogin(): Promise<void> {
    Logger.info('Haciendo clic en el botón de login');
    await this.click(this.selectors.loginButton, 'Login Button');
  }

  /**
   * Completar inicio de sesión con credenciales
   * Método de alto nivel que combina múltiples acciones
   */
  public async iniciarSesion(
    usernameOrCredentials: string | UserCredentials,
    password?: string
  ): Promise<void> {
    if (typeof usernameOrCredentials === 'string') {
      // Llamado con nombre de usuario y contraseña como parámetros separados
      Logger.info(`Iniciando sesión con usuario: ${usernameOrCredentials}`);
      await this.ingresarNombreUsuario(usernameOrCredentials);
      await this.ingresarContrasena(password!);
      await this.hacerClicBotonLogin();
    } else {
      // Llamado con objeto UserCredentials
      Logger.info(`Iniciando sesión con usuario: ${usernameOrCredentials.username}`);
      await this.ingresarNombreUsuario(usernameOrCredentials.username);
      await this.ingresarContrasena(usernameOrCredentials.password);
      await this.hacerClicBotonLogin();
    }
  }

  /**
   * Obtener el texto del mensaje de error
   */
  public async obtenerMensajeError(): Promise<string> {
    Logger.info('Obteniendo mensaje de error');
    await this.waitForElement(this.selectors.errorMessage, 'Error Message');
    return await this.getText(this.selectors.errorMessage);
  }

  /**
   * Verificar si el mensaje de error está visible
   */
  public async estaMensajeErrorVisible(): Promise<boolean> {
    return await this.isVisible(this.selectors.errorMessage);
  }
}
