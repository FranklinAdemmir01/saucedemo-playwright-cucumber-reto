/**
 * @file index.ts
 * @description Environment configurations entry point
 *
 * Import all environment configurations and export the current one
 */

// Import all environments to register them
import './dev.config';
import './qa.config';
import './prod.config';

// Export environment utilities
export {
  registerEnvironment,
  getEnvironment,
  getCurrentEnvironment,
  getCurrentEnvironmentName,
  listEnvironments,
  hasEnvironment,
} from '../environment.config';

// Export current environment configuration
import { getCurrentEnvironment } from '../environment.config';
export const config = getCurrentEnvironment();

// Export individual configs for direct access if needed
export { devConfig } from './dev.config';
export { qaConfig } from './qa.config';
export { prodConfig } from './prod.config';

// Export interface
export type { IEnvironmentConfig } from '../interfaces/IEnvironmentConfig';
