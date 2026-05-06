class HomeScreen {

    // ==== Core Home Elements ====
    get clockInBtn()       { return $('id=com.gwl.trashscan:id/buttonClockIn'); }
    get clockOutBtn()      { return $('id=com.gwl.trashscan:id/buttonClockOut'); }
    get hamburgerMenu()    { return $('id=com.gwl.trashscan:id/title_bar_left_menu'); }

    get workProgressTile() { return $('id=com.gwl.trashscan:id/ll_work_progress'); }
    get pickupTile()       { return $('id=com.gwl.trashscan:id/ivPickUp'); }
    get activityLogsTile() { return $('id=com.gwl.trashscan:id/ivRollback'); }
    get addNotesTile()     { return $('id=com.gwl.trashscan:id/ivAddNotes'); }
    get dailyWorkPlanTile(){ return $('id=com.gwl.trashscan:id/ivAddSubs'); }
    get violationTile()    { return $('id=com.gwl.trashscan:id/ivViolation'); }

    // ==== Wait for Home Screen (navigates back as needed) ====
    async waitForHomeScreen() {
        console.log('🏠 Navigating to Home screen...');

        await driver.waitUntil(
            async () => {
                if (await this.hamburgerMenu.isDisplayed().catch(() => false)) return true;
                if (await this.clockInBtn.isDisplayed().catch(() => false)) return true;
                if (await this.workProgressTile.isDisplayed().catch(() => false)) return true;
                // Not on home yet — press back and wait briefly before next poll
                await driver.back().catch(() => {});
                await driver.pause(800);
                return false;
            },
            { timeout: 30000, timeoutMsg: '❌ Could not reach Home screen after repeated back navigation' }
        );

        console.log('✅ Home screen loaded');
    }

    // ==== Wait for tiles after clock-in ====
    async waitForHomeTiles() {
        console.log('🏠 Waiting for Home screen tiles...');

        await driver.waitUntil(async () => {
            return (
                await this.workProgressTile.isDisplayed().catch(() => false) &&
                await this.pickupTile.isDisplayed().catch(() => false)
            );
        }, {
            timeout: 30000,
            timeoutMsg: '❌ Home screen tiles did not load properly'
        });

        console.log('✅ Home screen tiles loaded');
    }

    // ==== Navigate back safely ====
    async backToHome() {
        for (let i = 0; i < 8; i++) {
            const onHome = await this.hamburgerMenu.isDisplayed().catch(() => false)
                        || await this.clockInBtn.isDisplayed().catch(() => false)
                        || await this.workProgressTile.isDisplayed().catch(() => false);
            if (onHome) {
                console.log('🏠 Reached Home');
                return;
            }
            await driver.back().catch(() => {});
            await driver.pause(800);
        }

        throw new Error('❌ Failed to navigate back to Home');
    }

    // ==== Handle Camera Permission ====
    async allowCameraPermissionIfPresent() {
        try {
            const allowBtn = await $('android=new UiSelector().resourceId("com.android.permissioncontroller:id/permission_allow_button")');
            await allowBtn.waitForDisplayed({ timeout: 3000 });
            await allowBtn.click();
            console.log('📷 Camera permission allowed');
        } catch {
            console.log('ℹ️ Camera permission popup not shown');
        }
    }
}

module.exports = new HomeScreen();