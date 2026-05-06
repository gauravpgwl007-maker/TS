const Logout         = require('../pageobjects/logout');
const HomeScreen     = require('../pageobjects/home.screen');
const ClockOutScreen = require('../pageobjects/clockout.screen');
const ClockScreen    = require('../pageobjects/clockIn.screen');

describe('Logout flow', () => {
    it('should clockout (if needed) then logout from the app', async () => {
        await HomeScreen.backToHome();

        // If the user is still clocked in, clock out before logging out
        const clockOutVisible = await ClockOutScreen.clockOutBtn.isDisplayed().catch(() => false);
        if (clockOutVisible) {
            console.log('🕕 User still clocked in — performing Clock Out before logout');
            await ClockOutScreen.clockOutBtn.click();
            await ClockScreen.clockInBtn.waitForDisplayed({
                timeout: 60000,
                timeoutMsg: '❌ Clock In button did not reappear after Clock Out'
            });
            console.log('✅ Clock Out done');
        }

        await Logout.logout(true);

        const onLoginScreen =
            await $('id=com.gwl.trashscan:id/button_login').isDisplayed().catch(() => false) ||
            await $('id=com.gwl.trashscan:id/usrName').isDisplayed().catch(() => false);
        expect(onLoginScreen).toBe(true);
        console.log('✅ Logout successful — on login screen');
    });
});
