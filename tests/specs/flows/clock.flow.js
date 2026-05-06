const ClockScreen = require('../../pageobjects/clockIn.screen');

module.exports = {

    async performClockIn() {
        const visible = await ClockScreen.clockInBtn.isDisplayed().catch(()=>false);

        if (visible) {
            await ClockScreen.clockInBtn.click();
            await $('id=com.gwl.trashscan:id/buttonClockOut')
                .waitForDisplayed({ timeout: 60000 });
        }
    }

};