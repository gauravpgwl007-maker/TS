class DashboardScreen {

    // Source-verified from activity_tutorial.xml
    get skipBtn()     { return $('id=com.gwl.trashscan:id/intro_btn_skip'); }
    // Text-based fallbacks for builds that render the button as a TextView
    get skipBtnText() { return $('android=new UiSelector().textContains("Skip")'); }
    get skipBtnUpper(){ return $('android=new UiSelector().text("SKIP")'); }

    async skipToLogin() {
        try {
            // Wait for splash to finish and either the tutorial or login screen to appear
            await driver.waitUntil(async () => {
                return (
                    await this.skipBtn.isDisplayed().catch(() => false) ||
                    await this.skipBtnText.isDisplayed().catch(() => false) ||
                    await this.skipBtnUpper.isDisplayed().catch(() => false) ||
                    await $('id=com.gwl.trashscan:id/button_login').isDisplayed().catch(() => false) ||
                    await $('id=com.gwl.trashscan:id/usrName').isDisplayed().catch(() => false)
                );
            }, { timeout: 15000, interval: 500, timeoutMsg: 'App did not reach tutorial or login screen within 15s' });
        } catch (err) {
            console.log(`⚠️ ${err.message}`);
        }

        // Primary: resource ID (source-verified)
        if (await this.skipBtn.isDisplayed().catch(() => false)) {
            console.log('👉 Skip button found (resource ID) — clicking');
            await this.skipBtn.click();
            await driver.pause(1000);
            return;
        }
        // Fallback: text "Skip" / "SKIP"
        if (await this.skipBtnText.isDisplayed().catch(() => false)) {
            console.log('👉 Skip button found (text) — clicking');
            await this.skipBtnText.click();
            await driver.pause(1000);
            return;
        }
        if (await this.skipBtnUpper.isDisplayed().catch(() => false)) {
            console.log('👉 Skip button found (SKIP) — clicking');
            await this.skipBtnUpper.click();
            await driver.pause(1000);
            return;
        }
        console.log('ℹ️ Tutorial skip button not present — already past tutorial');
    }
}

module.exports = new DashboardScreen();
