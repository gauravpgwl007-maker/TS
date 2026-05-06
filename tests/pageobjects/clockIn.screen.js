class ClockScreen {

    // buttonClockIn has visibility="gone" in XML — ViewModel shows it when user is NOT clocked in
    get clockInBtn() {
        return $('id=com.gwl.trashscan:id/buttonClockIn');
    }

    async clockIn() {
        await this.clockInBtn.waitForDisplayed({ timeout: 15000,
            timeoutMsg: '❌ Clock In button not visible (user may already be clocked in)' });
        await driver.pause(500);
        await this.clockInBtn.click();
        console.log('✅ Clock In clicked');
    }
}

module.exports = new ClockScreen();
