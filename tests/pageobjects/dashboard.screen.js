class DashboardScreen {

    // Source-verified from activity_tutorial.xml
    get skipBtn()     { return $('id=com.gwl.trashscan:id/intro_btn_skip'); }
    // Text-based fallbacks for builds that render the button as a TextView
    get skipBtnText() { return $('android=new UiSelector().textContains("Skip")'); }
    get skipBtnUpper(){ return $('android=new UiSelector().text("SKIP")'); }

    async skipToLogin() {

    try {

        console.log('ℹ️ Waiting for app navigation...');

        await driver.pause(5000);

        const currentActivity = await driver.getCurrentActivity();

        console.log(`ℹ️ Current Activity after wait: ${currentActivity}`);

        // Tutorial screen
        if (currentActivity.includes('TutorialActivity')) {

            console.log('ℹ️ Tutorial screen detected');

            const skipSelectors = [
                this.skipBtn,
                this.skipBtnText,
                this.skipBtnUpper
            ];

            for (const btn of skipSelectors) {

                try {

                    if (await btn.waitForDisplayed({ timeout: 5000 })) {

                        console.log('👉 Skip button found — clicking');

                        await btn.click();

                        await driver.pause(3000);

                        return true;
                    }

                } catch (err) {
                    console.log('ℹ️ Skip selector not visible');
                }
            }

            console.log('⚠️ Tutorial detected but skip button not found');

            return false;
        }

        // Already on login screen
        if (
            currentActivity.includes('Login') ||
            currentActivity.includes('Auth')
        ) {

            console.log('ℹ️ Already on login screen');

            return true;
        }

        console.log(`ℹ️ Unexpected activity: ${currentActivity}`);

        return false;

    } catch (err) {

        console.log(`⚠️ skipToLogin() error: ${err.message}`);

        return false;
    }
}
}

module.exports = new DashboardScreen();
