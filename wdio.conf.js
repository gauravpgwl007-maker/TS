// wdio.conf.js (CLEAN + DEMO READY)
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

exports.config = {

  runner: 'local',
  specFileRetries: 0,
  hostname: '127.0.0.1',
  port: 4723,
  path: '/',

  // Nested array = all files share ONE Appium session (app opens once, stays open)
  specs: [[
    './tests/specs/launch.spec.js',
    './tests/specs/login.spec.js',
    './tests/specs/home.spec.js',
    './tests/specs/clockIn.spec.js',
    './tests/specs/workprogress.spec.js',
    './tests/specs/adminworkprogress.spec.js',
    './tests/specs/pickup.spec.js',
    './tests/specs/activitylogs.spec.js',
    './tests/specs/addnotes.spec.js',
    './tests/specs/dailyworkplan.spec.js',
    './tests/specs/violation.spec.js',
    './tests/specs/menu.spec.js',
    './tests/specs/messagebroadcast.spec.js',
    './tests/specs/notifications.spec.js',
    './tests/specs/clockout.spec.js',
    './tests/specs/settings.spec.js',
   // './tests/specs/demo.e2e.js',
    './tests/specs/logout.spec.js',
    //'./tests/specs/full.e2e.js',
  ]],

  maxInstances: 1,

  capabilities: [{
    platformName: 'Android',
    'appium:deviceName': 'emulator-5554',
    //'appium:platformVersion': '16',
    'appium:automationName': 'UiAutomator2',
    'appium:appPackage': 'com.gwl.trashscan',
    'appium:appActivity': 'com.gwl.trashscan.ui.splash.SplashActivity',
    'appium:noReset': false,
    'appium:fullReset': false,
    'appium:newCommandTimeout': 300,
    'appium:autoGrantPermissions': true
  }],

  logLevel: 'info',
  framework: 'mocha',

  mochaOpts: {
    timeout: 180000
  },

  reporters: [
    ['allure', {
      outputDir: 'allure-results',
      disableWebdriverStepsReporting: false,
      disableWebdriverScreenshotsReporting: false
    }]
  ],

  beforeSuite: function (suite) {
    console.log(`🚀 Starting suite: ${suite.title}`);
  },

  afterSuite: function (suite) {
    console.log(`✅ Finished suite: ${suite.title}`);
  },

  afterTest: async function (test) {
    const screenshotsDir = path.join(process.cwd(), 'screenshots');
    if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });
    try {
      // Remove characters illegal in Windows paths: : / \ * ? " < > |
      const safeTitle = test.title.replace(/[:/\\*?"<>|]/g, '-').replace(/\s+/g, '_');
      const timestamp = new Date().getTime();
      const fileName = path.join(screenshotsDir, `${safeTitle}_${timestamp}.png`);
      await driver.saveScreenshot(fileName);
      console.log(`📸 Screenshot saved: ${fileName}`);
    } catch {
      console.log('⚠️ Screenshot capture skipped (app may have crashed or path was invalid)');
    }
  },

  onPrepare: function () {
    const resultsDir = path.join(process.cwd(), 'allure-results');
    const reportDir = path.join(process.cwd(), 'allure-report');

    if (fs.existsSync(resultsDir)) fs.rmSync(resultsDir, { recursive: true, force: true });
    if (fs.existsSync(reportDir)) fs.rmSync(reportDir, { recursive: true, force: true });
  },

  onComplete: function () {
    try {
      execSync('npx allure generate allure-results -o allure-report --clean', { stdio: 'inherit' });
      spawn('npx', ['allure', 'open', 'allure-report'], { detached: true, stdio: 'ignore', shell: true }).unref();
    } catch (e) {
      console.log('⚠️ Allure report generation failed');
    }
  }
};