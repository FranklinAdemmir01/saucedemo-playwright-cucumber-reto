/**
 * @file dev.config.ts
 * @description Development environment configuration for Playwright tests
 *
 * Features:
 * - Non-headless for debugging
 * - Screenshots and videos enabled
 * - Tracing enabled for detailed debugging
 * - More lenient timeouts
 * - Debug-level logging
 */

import { IEnvironmentConfig } from '../interfaces/IEnvironmentConfig';
import { registerEnvironment } from '../environment.config';

export const devConfig: IEnvironmentConfig = {
  baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
  apiURL: process.env.API_URL,

  headless: process.env.HEADLESS === 'true',

  timeout: {
    default: 30000, // 30 seconds for normal operations
    short: 10000, // 10 seconds for quick actions
    long: 60000, // 1 minute for heavy operations
  },

  execution: {
    retries: parseInt(process.env.RETRY_ATTEMPTS || '2', 10),
    workers: parseInt(process.env.WORKERS || '5', 10),
  },

  browser: {
    slowMo: parseInt(process.env.SLOW_MO || '0', 10),
    ignoreHTTPSErrors: true,
    viewport: null, // Use native browser size (maximized)
  },

  features: {
    enableScreenshots: process.env.SCREENSHOT_ON_FAILURE !== 'false',
    enableVideos: process.env.VIDEO_ON_FAILURE !== 'false',
    enableTracing: false, // Set to true for detailed debugging
  },

  logger: {
    level: 'info',
    type: 'console',
    filePath: 'reports/logs/dev.log',
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

// Register development environment
registerEnvironment('dev', devConfig);
registerEnvironment('development', devConfig);

export default devConfig;
