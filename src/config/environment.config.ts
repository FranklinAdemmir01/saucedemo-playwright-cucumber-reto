/**
 * @file environment.config.ts
 * @description Central environment configuration manager
 *
 * Manages registration and retrieval of environment-specific configurations.
 * Supports multiple environments: dev, qa, staging, prod, etc.
 */

import { IEnvironmentConfig } from './interfaces/IEnvironmentConfig';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Registry of all available environments
 */
const environmentRegistry: Map<string, IEnvironmentConfig> = new Map();

/**
 * Register a new environment configuration
 * @param name - Environment name (dev, prod, qa, etc.)
 * @param config - Environment configuration object
 */
export function registerEnvironment(name: string, config: IEnvironmentConfig): void {
  environmentRegistry.set(name.toLowerCase(), config);
}

/**
 * Get configuration for a specific environment
 * @param name - Environment name
 * @returns Environment configuration
 * @throws Error if environment is not registered
 */
export function getEnvironment(name: string): IEnvironmentConfig {
  const env = name.toLowerCase();
  const config = environmentRegistry.get(env);

  if (!config) {
    const availableEnvs = Array.from(environmentRegistry.keys()).join(', ');
    throw new Error(`Environment "${name}" not found. Available environments: ${availableEnvs}`);
  }

  return config;
}

/**
 * Get current active environment based on ENV variable
 * Defaults to 'dev' if ENV is not set
 */
export function getCurrentEnvironment(): IEnvironmentConfig {
  const envName = process.env.ENV || process.env.NODE_ENV || 'dev';
  return getEnvironment(envName);
}

/**
 * List all registered environments
 */
export function listEnvironments(): string[] {
  return Array.from(environmentRegistry.keys());
}

/**
 * Check if an environment is registered
 */
export function hasEnvironment(name: string): boolean {
  return environmentRegistry.has(name.toLowerCase());
}

/**
 * Get current environment name
 */
export function getCurrentEnvironmentName(): string {
  return process.env.ENV || process.env.NODE_ENV || 'dev';
}
