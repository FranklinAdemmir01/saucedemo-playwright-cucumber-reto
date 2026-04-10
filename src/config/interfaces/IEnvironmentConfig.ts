/**
 * @file IEnvironmentConfig.ts
 * @description Interface for environment-specific configuration
 *
 * Defines the structure for environment configurations (dev, prod, qa, etc.)
 */

export interface ITimeoutConfig {
  default: number; // Default timeout for most operations
  short: number; // Quick actions (clicks, inputs)
  long: number; // Heavy operations (page loads, API calls)
}

export interface IBrowserConfig {
  slowMo: number;
  ignoreHTTPSErrors: boolean;
  viewport: {
    width: number;
    height: number;
  } | null;
}

export interface IFeaturesConfig {
  enableScreenshots: boolean;
  enableVideos: boolean;
  enableTracing: boolean;
}

export interface ILoggerConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  type: 'console' | 'file' | 'composite';
  filePath?: string;
}

export interface IExecutionConfig {
  retries: number;
  workers: number;
}

/**
 * Main environment configuration interface
 */
export interface IEnvironmentConfig {
  // URLs
  baseURL: string;
  apiURL?: string;

  // Browser settings
  headless: boolean;
  browser: IBrowserConfig;

  // Timeouts
  timeout: ITimeoutConfig;

  // Execution settings
  execution: IExecutionConfig;

  // Feature toggles
  features: IFeaturesConfig;

  // Logger configuration
  logger: ILoggerConfig;

  // Test data
  users?: {
    standard: { username: string; password: string };
    locked: { username: string; password: string };
    [key: string]: any;
  };
}
