/**
 * Test Execution Configuration
 * Centralizes test execution settings like parallelism, retries, timeouts
 * Now imports from centralized environment configuration
 */

import { config, getCurrentEnvironmentName } from './environments';

const testConfig = {
  /**
   * Parallel Execution Configuration
   */
  parallel: {
    // Number of parallel workers - from environment config
    workers: config.execution.workers,
  },

  /**
   * Retry Configuration
   */
  retry: {
    // Number of times to retry failed tests - from environment config
    attempts: config.execution.retries,

    // Tag to identify flaky tests that should be retried
    flakyTag: '@flaky',
  },

  /**
   * Test Paths Configuration
   */
  paths: {
    features: 'src/features/**/*.feature',
    steps: 'src/steps/**/*.ts',
    support: 'src/support/**/*.ts',
    hooks: 'src/hooks/**/*.ts',
  },

  /**
   * Report Configuration
   */
  reports: {
    formats: [
      'progress-bar',
      'html:reports/generated/cucumber-report.html',
      'json:reports/generated/cucumber-report.json',
      'junit:reports/generated/cucumber-report.xml',
    ],
    options: {
      snippetInterface: 'async-await',
      colorsEnabled: true,
    },
  },

  /**
   * Get current environment info
   */
  getEnvironmentInfo: () => {
    return {
      name: getCurrentEnvironmentName(),
      workers: config.execution.workers,
      retries: config.execution.retries,
      headless: config.headless,
      baseURL: config.baseURL,
    };
  },
};

// CommonJS export for backwards compatibility
module.exports = testConfig;

// ES6 export
export default testConfig;
