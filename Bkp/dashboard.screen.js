class DashboardScreen {

    // Source-verified from activity_tutorial.xml
    get skipBtn()     { return $('id=com.gwl.trashscan:id/intro_btn_skip'); }
    // Text-based fallbacks for builds that render the button as a TextView
    get skipBtnText() { return $('android=new UiSelector().textContains("Skip")'); }
    get skipBtnUpper(){ return $('android=new UiSelector().text("SKIP")'); }

    async skipToLogin() {
        try {
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
        } catch {
            console.log('⚠️ Error handling skip button');
        }
    }
}

module.exports = new DashboardScreen();
