/**
 * @file prod.config.ts
 * @description Production environment configuration for Playwright tests
 *
 * Features:
 * - Always headless
 * - Screenshots enabled, videos disabled
 * - No tracing (performance)
 * - Stricter timeouts
 * - Warn-level logging
 * - No retries (fail fast)
 * - Limited parallelism
 */

import { IEnvironmentConfig } from '../interfaces/IEnvironmentConfig';
import { registerEnvironment } from '../environment.config';

export const prodConfig: IEnvironmentConfig = {
  baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
  apiURL: process.env.API_URL,

  headless: true, // Always headless in production

  timeout: {
    default: 20000, // 20 seconds (fail faster)
    short: 5000, // 5 seconds for quick actions
    long: 40000, // 40 seconds for heavy operations
  },

  execution: {
    retries: 0, // No retries in production (fail fast)
    workers: parseInt(process.env.WORKERS || '2', 10), // Limited parallelism
  },

  browser: {
    slowMo: 0, // No slow motion
    ignoreHTTPSErrors: false, // Strict HTTPS
    viewport: null,
  },

  features: {
    enableScreenshots: true, // Keep screenshots for failures
    enableVideos: false, // Disable videos (performance/storage)
    enableTracing: false, // No tracing in production
  },

  logger: {
    level: 'warn', // Only warnings and errors
    type: 'file',
    filePath: 'reports/logs/prod.log',
  },

  users: {
    standard: {
      username: process.env.STANDARD_USER || 'standard_user',
      password: process.env.PASSWORD || 'secret_sauce',
    },
    locked: {
      username: process.env.LOCKED_USER || 'locked_out_user',
      password: process.env.PASSWORD || 'secret_sauce',
    },
  },
};

// Register production environment
registerEnvironment('prod', prodConfig);
registerEnvironment('production', prodConfig);

export default prodConfig;
