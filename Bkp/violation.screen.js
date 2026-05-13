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

    // ==== Selection Dialog Buttons ====
    get dialogDoneBtn()   { return $('android=new UiSelector().text("Done")'); }
    get dialogCancelBtn() { return $('android=new UiSelector().text("Cancel")'); }

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
    // ==== Pick first item from a selection dialog then tap Done ====
    // ================================================================
    async pickFirstAndConfirm() {
        // instance(0) is the dialog title TextView; instance(1) is the first list item
        const firstItem = await $('android=new UiSelector().className("android.widget.TextView").instance(1)');
        await firstItem.waitForDisplayed({ timeout: 10000 });
        const text = await firstItem.getText();
        await firstItem.click();
        await this.dialogDoneBtn.waitForDisplayed({ timeout: 5000 });
        await this.dialogDoneBtn.click();
        return text;
    }

    // ================================================================
    // ==== Submit Manual Violation Form ====
    // ================================================================
    async submitManualViolation() {

        await this.openViolationManual();

        // Select Property
        await this.propertyField.waitForDisplayed({ timeout: 8000 });
        await this.propertyField.click();
        await driver.pause(800);
        const propertyName = await this.pickFirstAndConfirm();
        console.log(`🏢 Selected Property: ${propertyName}`);

        // Select Building/Floor/Street
        await this.buildingField.waitForDisplayed({ timeout: 8000 });
        await this.buildingField.click();
        await driver.pause(800);
        const buildingName = await this.pickFirstAndConfirm();
        console.log(`🏬 Selected Building: ${buildingName}`);

        // Select Bin Tag ID
        await this.unitField.waitForDisplayed({ timeout: 8000 });
        await this.unitField.click();
        await driver.pause(800);
        const binName = await this.pickFirstAndConfirm();
        console.log(`🗑️ Selected Bin Tag: ${binName}`);

        // Select Violation Rule
        await this.reasonField.waitForDisplayed({ timeout: 8000 });
        await this.reasonField.click();
        await driver.pause(800);
        const ruleName = await this.pickFirstAndConfirm();
        console.log(`⚠️ Selected Rule: ${ruleName}`);

        // Select Violation Action
        await this.actionField.waitForDisplayed({ timeout: 8000 });
        await this.actionField.click();
        await driver.pause(800);
        const actionName = await this.pickFirstAndConfirm();
        console.log(`✅ Selected Action: ${actionName}`);

        // Enter Special Note
        await this.specialNotesField.waitForDisplayed({ timeout: 5000 });
        await this.specialNotesField.setValue('Automation test - Manual violation submitted successfully');

        // Submit
        await this.doneBtn.waitForDisplayed({ timeout: 5000 });
        await this.doneBtn.click();

        console.log('🎉 Manual Violation submitted successfully');
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
        // Always click the in-app backArrow — hardware back triggers a "Discard?" dialog
        // which then loops (back opens dialog, back dismisses dialog, form stays open)
        if (await this.backArrow.isDisplayed().catch(() => false)) {
            await this.backArrow.click();
        } else {
            await driver.back();
        }
        await driver.pause(600);
        // Dismiss any "Discard changes?" confirmation dialog that may appear
        for (const label of ['Discard', 'Yes', 'Leave', 'OK']) {
            try {
                const btn = await $(`android=new UiSelector().text("${label}")`);
                if (await btn.isDisplayed().catch(() => false)) {
                    await btn.click();
                    break;
                }
            } catch { /* no dialog present */ }
        }
        await driver.pause(800);
    }
}

module.exports = new ViolationScreen();
