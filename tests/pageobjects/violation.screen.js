class ViolationScreen {

    // ==== Tile on Home Screen ====
    get violationTile() { return $('id=com.gwl.trashscan:id/ivViolation'); }

    // ==== Violation Option Dialog (source-verified: dialog_voilation_conformation.xml) ====
    get manualOption()    { return $('id=com.gwl.trashscan:id/buttonManully'); }
    get scanViewOption()  { return $('id=com.gwl.trashscan:id/buttonScan'); }
    get quickSnapOption() { return $('id=com.gwl.trashscan:id/buttonQuickSnap'); }
    get dialogTitle()     { return $('android=new UiSelector().textContains("Choose Violation")'); }

    // ==== Manual Violation Form (source-verified: dialog_voilation_manually.xml) ====
    get propertyField()     { return $('id=com.gwl.trashscan:id/txt_property'); }
    get buildingField()     { return $('id=com.gwl.trashscan:id/txt_building'); }
    get unitField()         { return $('id=com.gwl.trashscan:id/txt_unit'); }
    get reasonField()       { return $('id=com.gwl.trashscan:id/txt_reason'); }
    get actionField()       { return $('id=com.gwl.trashscan:id/txt_action'); }
    get specialNotesField() { return $('id=com.gwl.trashscan:id/special_note_et'); }
    get doneBtn()           { return $('id=com.gwl.trashscan:id/text_done'); }
    get backArrow()         { return $('id=com.gwl.trashscan:id/backArrow'); }
    get historyIcon()       { return $('id=com.gwl.trashscan:id/historyIcon'); }
    get manualFormTitle()   { return $('android=new UiSelector().textContains("Manual Violation")'); }

    // ==== Scan View / Quick Snap Scanner ====
    get scannerView()     { return $('id=com.gwl.trashscan:id/surface_view'); }
    get captureBtn()      { return $('id=com.gwl.trashscan:id/captureButton'); }
    get activityLogsBar() { return $('id=com.gwl.trashscan:id/tv_activity_log_view'); }

    // ================================================================
    // ==== Open Violation Tile ====
    // ================================================================
    async openViolation() {
        await this.violationTile.waitForDisplayed({ timeout: 15000 });
        await this.violationTile.click();
    }

    // ================================================================
    // ==== Wait for Option Dialog ====
    // ================================================================
    async waitForDialog() {
        await driver.waitUntil(
            async () => {
                if (await this.manualOption.isDisplayed().catch(() => false))  return true;
                if (await this.dialogTitle.isDisplayed().catch(() => false))   return true;
                return false;
            },
            { timeout: 10000, timeoutMsg: '❌ Violation option dialog did not appear' }
        );
        console.log('📋 Violation option dialog visible');
    }

    // ================================================================
    // ==== Open Manual Violation Form ====
    // ================================================================
    async openViolationManual() {
        await this.openViolation();
        await this.waitForDialog();
        await this.manualOption.click();
        await this.propertyField.waitForDisplayed({ timeout: 15000 });
        console.log('✅ Manual Violation form loaded');
    }

    // ================================================================
    // ==== Open Scan View ====
    // ================================================================
    async openViolationScanView() {
        await this.openViolation();
        await this.waitForDialog();
        await this.scanViewOption.click();
        await driver.waitUntil(
            async () => {
                if (await this.scannerView.isDisplayed().catch(() => false))     return true;
                if (await this.activityLogsBar.isDisplayed().catch(() => false)) return true;
                return false;
            },
            { timeout: 15000, timeoutMsg: '❌ Scan View screen did not load' }
        );
        console.log('✅ Scan view opened');
    }

    // ================================================================
    // ==== Open Quick Snap ====
    // ================================================================
    async openViolationQuickSnap() {
        await this.openViolation();
        await this.waitForDialog();
        await this.quickSnapOption.click();
        await driver.waitUntil(
            async () => {
                if (await this.captureBtn.isDisplayed().catch(() => false))  return true;
                if (await this.scannerView.isDisplayed().catch(() => false)) return true;
                return false;
            },
            { timeout: 15000, timeoutMsg: '❌ Quick Snap screen did not load' }
        );
        console.log('✅ Quick Snap opened');
    }

    // ================================================================
    // ==== State Checks ====
    // ================================================================
    async isManualFormVisible() {
        return await this.propertyField.isDisplayed().catch(() => false);
    }

    // ================================================================
    // ==== Close Manual Form ====
    // ================================================================
    async closeManualForm() {
        if (await this.backArrow.isDisplayed().catch(() => false)) {
            await this.backArrow.click();
        } else {
            await driver.back();
        }
        await driver.pause(800);
    }
}

module.exports = new ViolationScreen();
