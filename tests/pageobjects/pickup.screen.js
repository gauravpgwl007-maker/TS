class PickupScreen {

    // ==== Tile on Home Screen ====
    get pickupTile() { return $('id=com.gwl.trashscan:id/ivPickUp'); }

    // ==== Pickup / Scanner Screen (source-verified: activity_pick_up.xml) ====
    get scannerView()       { return $('id=com.gwl.trashscan:id/surface_view'); }
    get switchCameraBtn()   { return $('id=com.gwl.trashscan:id/imageView_switch_camera'); }
    get flashBtn()          { return $('id=com.gwl.trashscan:id/imageView_flash_camera'); }
    get activityLogsBar()   { return $('id=com.gwl.trashscan:id/tv_activity_log_view'); }
    get arrowView()         { return $('id=com.gwl.trashscan:id/arrow_view'); }
    get bottomSheetLayout() { return $('id=com.gwl.trashscan:id/bottom_sheet_layout'); }
    get barcodeValue()      { return $('id=com.gwl.trashscan:id/barcode_value'); }

    // ==== Expanded Activity Logs Modal (BottomSheetDialogFragment) ====
    // This dialog is not cancelable via back button or tap-outside — verified
    // live on-device: pressing back and tapping the scrim both left it open.
    // Its own header must be tapped again to dismiss it.
    get activityLogsDialogHeader() { return $('id=com.gwl.trashscan:id/parent_layout'); }
    get activityLogsRecyclerView() { return $('id=com.gwl.trashscan:id/recyclerview_activity_log'); }

    // ================================================================
    // ==== Open Pickup ====
    // ================================================================
    async openPickup() {
        await this.pickupTile.waitForDisplayed({ timeout: 15000 });
        await this.pickupTile.click();
        await this.waitForPickupScreen();
    }

    // ================================================================
    // ==== Wait for Screen ====
    // ================================================================
    async waitForPickupScreen() {
        await driver.waitUntil(
            async () => {
                if (await this.scannerView.isDisplayed().catch(() => false))       return true;
                if (await this.activityLogsBar.isDisplayed().catch(() => false))   return true;
                if (await this.bottomSheetLayout.isDisplayed().catch(() => false)) return true;
                return false;
            },
            { timeout: 15000, timeoutMsg: '❌ Pickup screen did not load' }
        );
        console.log('✅ Pickup screen loaded');
    }

    // ================================================================
    // ==== State Checks ====
    // ================================================================
    async isScannerVisible() {
        return await this.scannerView.isDisplayed().catch(() => false);
    }

    async isActivityLogsBarVisible() {
        return await this.activityLogsBar.isDisplayed().catch(() => false);
    }

    // ================================================================
    // ==== Expand Activity Logs Panel ====
    // ================================================================
    async expandActivityLogsPanel() {
        try {
            if (await this.activityLogsBar.isDisplayed().catch(() => false)) {
                await this.activityLogsBar.click();
                await this.activityLogsDialogHeader.waitForDisplayed({ timeout: 5000 });
                console.log('📋 Activity Logs panel expanded');
            }
        } catch {
            console.log('⚠️ Could not expand Activity Logs panel');
        }
    }

    // ================================================================
    // ==== Collapse / Close Activity Logs Panel ====
    // Tap the dialog's own header again to dismiss it — back/tap-outside
    // don't work here.
    // ================================================================
    async collapseActivityLogsPanel() {
        try {
            if (await this.activityLogsDialogHeader.isDisplayed().catch(() => false)) {
                await this.activityLogsDialogHeader.click();
                await this.activityLogsDialogHeader.waitForDisplayed({ timeout: 5000, reverse: true });
                console.log('📋 Activity Logs panel collapsed');
            }
        } catch {
            console.log('⚠️ Could not collapse Activity Logs panel');
        }
    }

    // ================================================================
    // ==== Camera Permission ====
    // ================================================================
    async allowCameraPermissionIfPresent() {
        try {
            const allowBtn = await $('android=new UiSelector().resourceId("com.android.permissioncontroller:id/permission_allow_button")');
            await allowBtn.waitForDisplayed({ timeout: 3000 });
            await allowBtn.click();
            console.log('📷 Camera permission allowed');
        } catch {}
    }
}

module.exports = new PickupScreen();
