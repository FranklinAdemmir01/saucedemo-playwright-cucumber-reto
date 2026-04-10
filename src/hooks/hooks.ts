import {
  Before,
  After,
  BeforeAll,
  AfterAll,
  AfterStep,
  Status,
  setDefaultTimeout,
} from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { Logger } from '../utils/logger';
import { ScreenshotHelper } from '../utils/screenshot.helper';
import fs from 'fs-extra';
import path from 'path';

// Set default timeout for all steps
setDefaultTimeout(60000);

/**
 * BeforeAll Hook
 * Runs once before all scenarios
 * Setup global test environment and clean previous test artifacts
 */
BeforeAll(async function () {
  Logger.info('========================================');
  Logger.info('Test Suite Execution Started');
  Logger.info('========================================');

  // Clean previous test artifacts (videos and screenshots from previous runs)
  // Only clean if not running in parallel workers (to avoid race conditions)
  const cleanupDirs = [
    path.join(process.cwd(), 'reports', 'screenshots'),
    path.join(process.cwd(), 'reports', 'videos'),
  ];

  try {
    for (const dir of cleanupDirs) {
      if (await fs.pathExists(dir)) {
        const files = await fs.readdir(dir);
        let deletedCount = 0;
        for (const file of files) {
          try {
            const filePath = path.join(dir, file);
            const stat = await fs.stat(filePath);
            if (stat.isFile()) {
              await fs.remove(filePath);
              deletedCount++;
            }
          } catch (error) {
            // Ignore errors (file might be deleted by another worker)
          }
        }
        if (deletedCount > 0) {
          Logger.info(`Cleaned ${deletedCount} old files from ${path.basename(dir)}`);
        }
      }
    }
  } catch (error) {
    // Silently ignore cleanup errors in parallel execution
    Logger.debug('Cleanup skipped or partially completed (parallel execution)');
  }

  // Ensure report directories exist
  const reportsDirs = [
    path.join(process.cwd(), 'reports', 'screenshots'),
    path.join(process.cwd(), 'reports', 'videos'),
    path.join(process.cwd(), 'reports', 'logs'),
    path.join(process.cwd(), 'reports', 'generated'),
  ];

  for (const dir of reportsDirs) {
    await fs.ensureDir(dir);
  }

  Logger.info('Report directories initialized');
});

/**
 * Before Hook
 * Runs before each scenario
 * Initialize browser and setup test context
 */
Before(async function (this: CustomWorld, { pickle }) {
  Logger.info('----------------------------------------');
  Logger.info(`Scenario: ${pickle.name}`);
  Logger.info('----------------------------------------');

  // Initialize browser and page
  await this.init();

  // Store scenario name in context
  this.setTestData('scenarioName', pickle.name);
  this.setTestData('startTime', Date.now());

  Logger.info('Scenario setup completed');
});

/**
 * After Hook
 * Runs after each scenario
 * Cleanup and capture failure screenshots
 */
After(async function (this: CustomWorld, { pickle, result }) {
  const scenarioName = pickle.name.replace(/[^a-zA-Z0-9]/g, '_');
  const startTime = this.getTestData<number>('startTime') || Date.now();
  const duration = Date.now() - startTime;

  // Log scenario result
  if (result?.status === Status.PASSED) {
    Logger.info(`✓ Scenario PASSED: ${pickle.name} (${duration}ms)`);
  } else if (result?.status === Status.FAILED) {
    Logger.error(`✗ Scenario FAILED: ${pickle.name} (${duration}ms)`);

    // Capture screenshot on failure
    if (this.page) {
      try {
        const screenshotPath = await ScreenshotHelper.takeScreenshotOnFailure(
          this.page,
          scenarioName
        );

        if (screenshotPath) {
          // Attach screenshot to report
          const screenshot = await fs.readFile(screenshotPath);
          await this.attach(screenshot, 'image/png');
          Logger.info(`Screenshot attached to report: ${screenshotPath}`);
        }
      } catch (error) {
        Logger.error('Failed to capture failure screenshot', { error });
      }
    }

    // Log error message if available
    if (result?.message) {
      Logger.error('Failure details:', { message: result.message });
    }
  } else if (result?.status === Status.SKIPPED) {
    Logger.warn(`⊘ Scenario SKIPPED: ${pickle.name}`);
  }

  // Get video path before closing page
  let videoPath: string | null = null;
  try {
    if (this.page && this.page.video()) {
      videoPath = await this.page.video()!.path();
      Logger.debug(`Video path obtained: ${videoPath}`);
    }
  } catch (error) {
    Logger.debug('No video available or error getting video path');
  }

  // Cleanup browser (this finalizes video recording)
  await this.cleanup();

  // Wait a bit for video to be fully written
  if (videoPath) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Attach video to report if available
  if (videoPath && fs.existsSync(videoPath)) {
    try {
      const video = await fs.readFile(videoPath);
      await this.attach(video, 'video/webm');
      Logger.info(`Video attached to report: ${videoPath}`);
    } catch (error) {
      Logger.error('Failed to attach video to report', { error });
    }
  }

  // Clear test data
  this.clearTestData();

  Logger.info('Scenario cleanup completed');
  Logger.info('----------------------------------------\n');
});

/**
 * AfterStep Hook
 * Runs after each step
 * Capture screenshots on validation steps (Then/Entonces)
 */
AfterStep(async function (this: CustomWorld, { pickle, pickleStep, result }) {
  // Capturar screenshot en steps de validación (detectamos por el texto del step)
  const stepText = (pickleStep?.text || '').toLowerCase();

  // Palabras clave que indican validación/verificación (específicas de Then steps)
  const validationKeywords = [
    'debería',
    'deberían',
    'should',
    'debe',
    'deben',
    'must',
    'verificar',
    'verify',
    'validar',
    'validate',
    'confirmar',
    'confirm',
    'asegurar',
    'ensure',
  ];

  // Verificar si es un step de validación
  const isValidationStep = validationKeywords.some((keyword) => stepText.includes(keyword));

  if (isValidationStep && result?.status === Status.PASSED && this.page) {
    try {
      const scenarioName = pickle.name.replace(/[^a-zA-Z0-9 ]/g, '_');
      const stepName = (pickleStep.text || 'step').replace(/[^a-zA-Z0-9 ]/g, '_').substring(0, 50);
      const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
      const fileName = `VALIDACION_${scenarioName}_${stepName}_${timestamp}.png`;
      const screenshotPath = path.join(process.cwd(), 'reports', 'screenshots', fileName);

      await fs.ensureDir(path.join(process.cwd(), 'reports', 'screenshots'));
      await this.page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });

      // Adjuntar screenshot al reporte
      const screenshot = await fs.readFile(screenshotPath);
      await this.attach(screenshot, 'image/png');

      Logger.info(`📸 Screenshot validación: ${stepName.substring(0, 40)}...`);
    } catch (error: any) {
      Logger.error(`Error capturando screenshot: ${error.message}`);
    }
  }
});

/**
 * AfterAll Hook
 * Runs once after all scenarios
 * Global cleanup and final reporting
 */
AfterAll(async function () {
  Logger.info('========================================');
  Logger.info('Test Suite Execution Completed');
  Logger.info('========================================');

  // Could add additional cleanup or reporting logic here
});

/**
 * Hook for specific tags
 * Example: @slow - increase timeout for slow tests
 */
Before({ tags: '@slow' }, async function (this: CustomWorld) {
  Logger.info('Slow test detected - increasing timeout');
  setDefaultTimeout(120000);
});

/**
 * Hook for cleanup specific scenarios
 * Example: @cleanup - perform additional cleanup
 */
After({ tags: '@cleanup' }, async function (this: CustomWorld) {
  Logger.info('Performing additional cleanup for @cleanup tag');
  // Add specific cleanup logic here if needed
});
