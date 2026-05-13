class ClockOutScreen {

    // buttonClockOut has visibility="gone" in XML — ViewModel shows it when user IS clocked in
    get clockOutBtn() {
        return $('id=com.gwl.trashscan:id/buttonClockOut');
    }

    async clockOut() {
        await this.clockOutBtn.waitForDisplayed({ timeout: 15000,
            timeoutMsg: '❌ Clock Out button not visible (user may not be clocked in)' });
        await this.clockOutBtn.click();
        console.log('✅ Clock Out clicked');
    }
}

module.exports = new ClockOutScreen();
