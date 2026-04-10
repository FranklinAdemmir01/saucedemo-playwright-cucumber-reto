/**
 * @file qa.config.ts
 * @description QA environment configuration for Playwright tests
 *
 * Features:
 * - Headless by default (can override)
 * - All debugging features enabled
 * - Balanced timeouts
 * - More retries for flaky tests
 * - Info-level logging
 */

import { IEnvironmentConfig } from '../interfaces/IEnvironmentConfig';
import { registerEnvironment } from '../environment.config';

export const qaConfig: IEnvironmentConfig = {
  baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
  apiURL: process.env.API_URL,

  headless: process.env.HEADLESS !== 'false',

  timeout: {
    default: 30000, // 30 seconds
    short: 10000, // 10 seconds
    long: 60000, // 1 minute
  },

  execution: {
    retries: parseInt(process.env.RETRY_ATTEMPTS || '2', 10),
    workers: parseInt(process.env.WORKERS || '5', 10),
  },

  browser: {
    slowMo: parseInt(process.env.SLOW_MO || '0', 10),
    ignoreHTTPSErrors: true,
    viewport: null,
  },

  features: {
    enableScreenshots: true,
    enableVideos: true,
    enableTracing: process.env.ENABLE_TRACING === 'true',
  },

  logger: {
    level: 'info',
    type: 'composite', // Both console and file
    filePath: 'reports/logs/qa.log',
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

// Register QA environment
registerEnvironment('qa', qaConfig);
registerEnvironment('test', qaConfig);

export default qaConfig;
