const reporter = require('cucumber-html-reporter');
const path = require('path');
const fs = require('fs-extra');

/**
 * Alternative reporter using cucumber-html-reporter
 * Provides a simpler, single-file HTML report
 */
function generateSimpleReport() {
  const jsonFile = path.join(process.cwd(), 'reports', 'generated', 'cucumber-report.json');
  const htmlFile = path.join(process.cwd(), 'reports', 'generated', 'simple-report.html');
  
  if (!fs.existsSync(jsonFile)) {
    console.error('JSON report not found:', jsonFile);
    return;
  }

  const options = {
    theme: 'bootstrap',
    jsonFile: jsonFile,
    output: htmlFile,
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    launchReport: false,
    ignoreBadJsonFile: true,
    metadata: {
      'App Name': 'SauceDemo',
      'Test Environment': process.env.BASE_URL || 'https://www.saucedemo.com',
      'Browser': process.env.BROWSER || 'chromium',
      'Platform': process.platform,
      'Executed': new Date().toLocaleString(),
    },
  };

  try {
    reporter.generate(options);
    console.log('Simple HTML report generated:', htmlFile);
  } catch (error) {
    console.error('Failed to generate simple report:', error);
  }
}

// Execute if called directly
if (require.main === module) {
  generateSimpleReport();
}

module.exports = { generateSimpleReport };
