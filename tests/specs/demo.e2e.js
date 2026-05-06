const DashboardScreen = require('../pageobjects/dashboard.screen');
const LoginScreen     = require('../pageobjects/login.screen');
const HomeScreen      = require('../pageobjects/home.screen');
const ClockScreen     = require('../pageobjects/clockIn.screen');
const ClockOutScreen  = require('../pageobjects/clockout.screen');
const users           = require('../fixtures/users.json');

describe('E2E DEMO FLOW', () => {

    it('Launch → Login → Home → ClockIn → ClockOut', async () => {

        console.log('🚀 Starting Demo Flow');

        // After TC165 logout in settings.spec.js the app may show the onboarding/
        // dashboard screen before the login screen — skip it first.
        await DashboardScreen.skipToLogin();
        await LoginScreen.allowLocationPermissionIfPresent();

        await LoginScreen.login(users.valid.username, users.valid.password);

        await HomeScreen.waitForHomeScreen();
        console.log('✅ Home loaded');

        // Clock In (only if not already clocked in)
        const clockInVisible = await ClockScreen.clockInBtn.isDisplayed().catch(() => false);
        if (clockInVisible) {
            await ClockScreen.clockInBtn.click();
            await driver.pause(2000);
            console.log('✅ Clock In performed');
        } else {
            console.log('⚠️ Already clocked in');
        }

        // Clock Out before logout so the session is cleanly closed
        await HomeScreen.waitForHomeScreen();
        const clockOutVisible = await ClockOutScreen.clockOutBtn.isDisplayed().catch(() => false);
        if (clockOutVisible) {
            await ClockOutScreen.clockOutBtn.click();
            await ClockScreen.clockInBtn.waitForDisplayed({
                timeout: 60000,
                timeoutMsg: '❌ Clock In button did not reappear after Clock Out'
            });
            console.log('✅ Clock Out performed');
        } else {
            console.log('⚠️ Clock Out button not visible — skipping');
        }

        // Return to Home so logout.spec.js starts from a known screen
        await HomeScreen.backToHome();

        console.log('🎉 DEMO FLOW COMPLETED');

    });

});