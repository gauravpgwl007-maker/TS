const HomeScreen     = require('../pageobjects/home.screen');
const ClockScreen    = require('../pageobjects/clockIn.screen');
const ClockOutScreen = require('../pageobjects/clockout.screen');

describe('Clock In', () => {

    before(async () => {
        await HomeScreen.waitForHomeScreen();
    });

    it('should perform Clock In if button is available', async () => {
        await HomeScreen.waitForHomeScreen();

        const clockInVisible = await ClockScreen.clockInBtn.isDisplayed().catch(() => false);
        if (clockInVisible) {
            console.log('🕓 Clock In button found, performing action...');
            await ClockScreen.clockInBtn.click();
            // API call can take 10-30s — wait up to 60s for clockOut button to appear
            await ClockOutScreen.clockOutBtn.waitForDisplayed({
                timeout: 60000,
                timeoutMsg: '❌ Clock Out button did not appear after Clock In. API may be slow or Clock In failed.'
            });
            console.log('✅ Clock In confirmed — Clock Out button is now visible');
        } else {
            console.log('⚠️ Clock In button not visible — user may already be clocked in. Skipping.');
        }
    });
});
