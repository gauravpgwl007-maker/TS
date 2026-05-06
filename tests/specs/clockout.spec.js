const HomeScreen     = require('../pageobjects/home.screen');
const ClockScreen    = require('../pageobjects/clockIn.screen');
const ClockOutScreen = require('../pageobjects/clockout.screen');

describe('Clock Out', () => {

    before(async () => {
        await HomeScreen.waitForHomeScreen();
    });

    it('should perform Clock Out if button is available', async () => {
        await HomeScreen.waitForHomeScreen();

        const clockOutVisible = await ClockOutScreen.clockOutBtn.isDisplayed().catch(() => false);
        if (clockOutVisible) {
            console.log('🕕 Clock Out button found, performing action...');
            await ClockOutScreen.clockOutBtn.click();
            // API call can take 10-30s — wait up to 60s for clockIn button to reappear
            await ClockScreen.clockInBtn.waitForDisplayed({
                timeout: 60000,
                timeoutMsg: '❌ Clock In button did not appear after Clock Out. API may be slow or Clock Out failed.'
            });
            console.log('✅ Clock Out confirmed — Clock In button is now visible');
        } else {
            console.log('⚠️ Clock Out button not visible — user may not be clocked in. Skipping.');
        }
    });
});
