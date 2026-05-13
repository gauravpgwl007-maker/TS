// wdio.conf.js (CLEAN + DEMO READY)
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Fixed paths — known at module-load time so both main process (onPrepare/onComplete)
// and worker processes (afterTest) can read/write to the same files.
const LOGS_DIR    = path.join(process.cwd(), 'logs');
const RUN_LOG     = path.join(LOGS_DIR, 'run.log');
const RESULTS_FILE = path.join(LOGS_DIR, 'results.jsonl');
const SUMMARY_FILE = path.join(LOGS_DIR, 'latest-summary.log');

// Ensure logs dir exists when the module first loads (works in all processes)
if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR, { recursive: true });

function ts() {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

function appendLog(line) {
  fs.appendFileSync(RUN_LOG, line + '\n', 'utf8');
}

exports.config = {

  runner: 'local',
  specFileRetries: 0,
  hostname: '127.0.0.1',
  port: 4723,
  path: '/',

  // Nested array = all files share ONE Appium session (app opens once, stays open)
  specs: [[
   // './tests/specs/launch.spec.js',
   // './tests/specs/login.spec.js',
 //   './tests/specs/home.spec.js',
 //   './tests/specs/clockIn.spec.js',
 //   './tests/specs/workprogress.spec.js',
 //   './tests/specs/adminworkprogress.spec.js',
   // './tests/specs/pickup.spec.js',
  //  './tests/specs/activitylogs.spec.js',
   // './tests/specs/addnotes.spec.js',
 //   './tests/specs/dailyworkplan.spec.js',
  //  './tests/specs/violation.spec.js',
   // './tests/specs/menu.spec.js',
    //'./tests/specs/messagebroadcast.spec.js',
  //  './tests/specs/notifications.spec.js',
   // './tests/specs/clockout.spec.js',
  //  './tests/specs/settings.spec.js',
   // './tests/specs/demo.e2e.js',
  //  './tests/specs/logout.spec.js',
    './tests/specs/full.e2e.js',
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

  logLevel: 'warn',
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
    const msg = `\n${'─'.repeat(60)}\n[${ts()}] 🚀 Suite: ${suite.title}\n${'─'.repeat(60)}`;
    console.log(msg);
    appendLog(msg);
  },

  afterSuite: function (suite) {
    const msg = `[${ts()}] ✅ Suite done: ${suite.title}`;
    console.log(msg);
    appendLog(msg);
  },

  afterTest: async function (test, context, { error, duration, passed }) {
    const secs = (duration / 1000).toFixed(1);
    const status = passed ? '✅ PASS' : '❌ FAIL';

    // Print clear one-liner for every test outcome
    let consoleLine = `[${ts()}] ${status}  (${secs}s)  ${test.parent} › ${test.title}`;
    if (error) consoleLine += `\n         ↳ Error: ${error.message}`;
    console.log(consoleLine);
    appendLog(consoleLine);

    // Screenshot + crash detection
    const screenshotsDir = path.join(process.cwd(), 'screenshots');
    if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });
    let crashed = false;
    try {
      // Remove characters illegal in Windows paths: : / \ * ? " < > |
      const safeTitle = test.title.replace(/[:/\\*?"<>|]/g, '-').replace(/\s+/g, '_');
      const timestamp = new Date().getTime();
      const fileName = path.join(screenshotsDir, `${safeTitle}_${timestamp}.png`);
      await driver.saveScreenshot(fileName);
      console.log(`📸 Screenshot saved: ${fileName}`);
    } catch {
      crashed = true;
      const crashMsg = `[${ts()}] ⚠️  CRASH DETECTED — screenshot unavailable after: ${test.parent} › ${test.title}`;
      console.log(crashMsg);
      appendLog(crashMsg);
    }

    // Persist result to file so onComplete (main process) can read it
    const entry = {
      suite: test.parent,
      title: test.title,
      passed,
      duration: secs,
      error: error ? error.message : null,
      crashed,
      time: ts()
    };
    fs.appendFileSync(RESULTS_FILE, JSON.stringify(entry) + '\n', 'utf8');

    // If instrumentation crashed, relaunch the app so subsequent specs can continue
    if (crashed) {
      try {
        const relaunchMsg = `[${ts()}] 🔄 Relaunching app after crash...`;
        console.log(relaunchMsg);
        appendLog(relaunchMsg);
        await driver.activateApp('com.gwl.trashscan');
        await driver.pause(4000);
        const okMsg = `[${ts()}] ✅ App relaunched — subsequent specs can continue`;
        console.log(okMsg);
        appendLog(okMsg);
      } catch {
        const failMsg = `[${ts()}] ⚠️  App relaunch failed — session may be unrecoverable`;
        console.log(failMsg);
        appendLog(failMsg);
      }
    }
  },

  onPrepare: function () {
    // Clear log files for fresh run — this runs in the main process
    fs.writeFileSync(RUN_LOG, `Test Run Started: ${ts()}\n${'='.repeat(60)}\n`, 'utf8');
    fs.writeFileSync(RESULTS_FILE, '', 'utf8');
    console.log(`\n📝 Logging to: ${RUN_LOG}\n`);

    const resultsDir = path.join(process.cwd(), 'allure-results');
    const reportDir = path.join(process.cwd(), 'allure-report');

    if (fs.existsSync(resultsDir)) fs.rmSync(resultsDir, { recursive: true, force: true });
    if (fs.existsSync(reportDir)) fs.rmSync(reportDir, { recursive: true, force: true });
  },

  onComplete: function () {
    // Read results written by worker processes via RESULTS_FILE
    let testResults = [];
    try {
      const raw = fs.readFileSync(RESULTS_FILE, 'utf8');
      testResults = raw.split('\n').filter(Boolean).map(l => JSON.parse(l));
    } catch {
      console.log('⚠️ Could not read results file for summary');
    }

    const passed  = testResults.filter(r => r.passed).length;
    const failed  = testResults.filter(r => !r.passed).length;
    const crashed = testResults.filter(r => r.crashed).length;
    const total   = testResults.length;

    const divider = '='.repeat(60);
    const summaryLines = [
      '',
      divider,
      `TEST RUN SUMMARY  —  ${ts()}`,
      divider,
      `Total: ${total}  |  ✅ Passed: ${passed}  |  ❌ Failed: ${failed}  |  💥 Crashed: ${crashed}`,
      divider,
      '',
      'DETAILED RESULTS:',
      ...testResults.map((r, i) => {
        const icon = r.crashed ? '💥' : (r.passed ? '✅' : '❌');
        let line = `  ${String(i + 1).padStart(2, '0')}. ${icon} [${r.passed ? 'PASS' : 'FAIL'}] (${r.duration}s)  ${r.suite} › ${r.title}`;
        if (r.error) line += `\n         Error: ${r.error}`;
        if (r.crashed) line += '\n         ⚠ Instrumentation crash detected';
        return line;
      }),
      '',
      divider,
    ];

    if (failed > 0 || crashed > 0) {
      summaryLines.push('FAILURES / CRASHES:');
      testResults
        .filter(r => !r.passed || r.crashed)
        .forEach((r, i) => {
          summaryLines.push(`  ${i + 1}. ${r.suite} › ${r.title}`);
          if (r.error) summaryLines.push(`     Error: ${r.error}`);
          if (r.crashed) summaryLines.push('     Cause: App/instrumentation crash');
        });
      summaryLines.push(divider);
    }

    const summaryText = summaryLines.join('\n');
    console.log(summaryText);
    appendLog(summaryText);
    fs.writeFileSync(SUMMARY_FILE, summaryText, 'utf8');
    console.log(`\n📊 Summary saved to: ${SUMMARY_FILE}`);

    try {
      execSync('npx allure generate allure-results -o allure-report --clean', { stdio: 'inherit' });
      spawn('npx', ['allure', 'open', 'allure-report'], { detached: true, stdio: 'ignore', shell: true }).unref();
    } catch (e) {
      console.log('⚠️ Allure report generation failed');
    }
  }
};
