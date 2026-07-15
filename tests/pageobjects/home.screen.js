class HomeScreen {

    // ==== Core Home Elements ====
    get clockInBtn()       { return $('id=com.gwl.trashscan:id/buttonClockIn'); }
    get clockOutBtn()      { return $('id=com.gwl.trashscan:id/buttonClockOut'); }
    get hamburgerMenu()    { return $('id=com.gwl.trashscan:id/title_bar_left_menu'); }
    get homeIcon()         { return $('id=com.gwl.trashscan:id/title_bar_left_menu'); }

    get workProgressTile() { return $('id=com.gwl.trashscan:id/ll_work_progress'); }
    get pickupTile()       { return $('id=com.gwl.trashscan:id/ivPickUp'); }
    get activityLogsTile() { return $('id=com.gwl.trashscan:id/ivRollback'); }
    get addNotesTile()     { return $('id=com.gwl.trashscan:id/ivAddNotes'); }
    get dailyWorkPlanTile(){ return $('android=new UiSelector().text("Daily Work Plan")'); }
    get violationTile()    { return $('id=com.gwl.trashscan:id/ivViolation'); }

    // ==== Drawer-only element — its presence means the nav drawer is open
    // and overlapping the home screen, even though the hamburger/tiles behind
    // it still report isDisplayed()=true. Any leftover open drawer (e.g. a
    // previous test bailed out mid-navigation) must be closed before we trust
    // that a click will land on the real home screen underneath it. ====
    get drawerHomeItem()   { return $('id=com.gwl.trashscan:id/home'); }

    async closeDrawerIfOpen() {
        for (let i = 0; i < 3; i++) {
            const drawerOpen = await this.drawerHomeItem.isDisplayed().catch(() => false);
            if (!drawerOpen) return;
            console.log('⚠️ Nav drawer left open — closing it');
            await driver.back().catch(() => {});
            await driver.pause(600);
        }
    }

    // ==== "Manual Clock Out" dialog ====
    // The app blocks clocking in for today if you forgot to clock out on a
    // previous day, showing this modal ("You forgot to clock out on <date>...")
    // over the home screen until a reason is submitted. Confirmed live
    // on-device — it silently blocks all further interaction until handled.
    get manualClockOutDialog()      { return $('android=new UiSelector().textContains("Manual Clock Out")'); }
    get manualClockOutReasonField() { return $('android=new UiSelector().className("android.widget.EditText")'); }
    get manualClockOutSubmitBtn()   { return $('android=new UiSelector().text("Submit")'); }

    async handleManualClockOutIfPresent() {
        const dialogVisible = await this.manualClockOutDialog.isDisplayed().catch(() => false);
        if (!dialogVisible) return false;

        console.log('⚠️ Manual Clock Out dialog detected — submitting to unblock clock-in');
        await this.manualClockOutReasonField.click();
        await this.manualClockOutReasonField.setValue('Missed clock out - auto submitted by test');
        await driver.hideKeyboard().catch(() => {});
        await this.manualClockOutSubmitBtn.click();
        await driver.pause(1500);
        return true;
    }

    // ==== Wait for Home Screen (toolbar is always present after login) ====
    async waitForHomeScreen() {
        console.log('🏠 Waiting for Home screen...');

        // The hamburger menu / toolbar is always present right after login,
        // regardless of clock-in state. Tiles only appear after clock-in.
        await this.hamburgerMenu.waitForDisplayed({ timeout: 30000 });

        // Clear any blocking Manual Clock Out dialog before anything else.
        await this.handleManualClockOutIfPresent();

        // Make sure no stale open drawer is sitting on top of the home screen.
        await this.closeDrawerIfOpen();

        // Also accept the clock-in button as a valid home screen indicator
        const clockInVisible = await this.clockInBtn.isDisplayed().catch(() => false);
        const tilesVisible   = await this.workProgressTile.isDisplayed().catch(() => false);

        if (!clockInVisible && !tilesVisible) {
            console.log('⚠️ Neither clock-in button nor work-progress tile found — check app state');
        }

        console.log('✅ Home screen loaded');
    }

    // ==== Wait specifically for the post-clock-in tile grid ====
    async waitForHomeTiles() {
        console.log('🏠 Waiting for Home screen tiles...');

        await driver.waitUntil(async () => {
            const tiles = [
                this.workProgressTile,
                this.pickupTile,
                this.activityLogsTile,
                this.addNotesTile,
                this.dailyWorkPlanTile,
                this.violationTile
            ];

            let visibleCount = 0;
            for (const tile of tiles) {
                if (await tile.isDisplayed().catch(() => false)) {
                    visibleCount++;
                }
            }
            return visibleCount >= 4;
        }, {
            timeout: 30000,
            timeoutMsg: '❌ Home screen tiles did not load properly'
        });

        console.log('✅ Home screen tiles loaded');
    }

    async backToHome() {
        await this.closeDrawerIfOpen();
        for (let i = 0; i < 8; i++) {
            const onHome = await this.hamburgerMenu.isDisplayed().catch(() => false);
            const drawerOpen = await this.drawerHomeItem.isDisplayed().catch(() => false);
            if (onHome && !drawerOpen) break;
            await driver.back();
            await driver.pause(800);
        }
        await this.waitForHomeScreen();
    }

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