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

    // ==== Building / Bin Tag / Rule / Action pickers ====
    // Unlike the property picker, these ARE real accessible dialogs (proper
    // itemName/doneBtn resource-ids) — confirmed live on-device.
    get firstListItem() { return $('id=com.gwl.trashscan:id/itemName'); }
    get listDoneBtn()   { return $('id=com.gwl.trashscan:id/doneBtn'); }

    // ==== Add Images ====
    // Opens a custom camera/gallery chooser (not the system one) — confirmed
    // live: profile_camera/profile_gallery/profile_cancel are real, properly
    // accessible ids. "Take Photo" opens the same in-app multi-capture
    // camera used elsewhere in the app (captureButton/nextTextView).
    get addImagesBtn()      { return $('id=com.gwl.trashscan:id/ll_addImage'); }
    get takePhotoOption()   { return $('id=com.gwl.trashscan:id/profile_camera'); }
    get choosePhotoOption() { return $('id=com.gwl.trashscan:id/profile_gallery'); }
    get cameraNextBtn()     { return $('id=com.gwl.trashscan:id/nextTextView'); }

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
    // ==== Select first property (custom, non-accessible dialog) ====
    // Same "Select Property" search dialog used on the Add Notes screen —
    // it renders outside the accessibility tree entirely (verified live: a
    // uiautomator dump while it was on screen returned nothing usable), so
    // it's driven by coordinate taps measured against the real layout
    // instead of element selectors.
    // ================================================================
    async _tapByPercent(xPct, yPct) {
        const { width, height } = await driver.getWindowSize();
        await driver.action('pointer')
            .move({ x: Math.round(width * xPct), y: Math.round(height * yPct) })
            .down()
            .up()
            .perform();
    }

    async selectFirstProperty() {
        await this.propertyField.click();
        await driver.pause(800);
        await this._tapByPercent(0.43, 0.286); // first property row
        await driver.pause(500);
        await this._tapByPercent(0.70, 0.835); // dialog's own Done button
        await driver.pause(500);
        console.log('✅ Property selected');
    }

    // ================================================================
    // ==== Select first item from an accessible list picker ====
    // Shared by Building, Bin Tag ID, Violation Rule, and Violation Action —
    // all four use the same real dialog component.
    // ================================================================
    async _selectFirstFromListPicker(triggerField, label) {
        await triggerField.click();
        await this.firstListItem.waitForDisplayed({ timeout: 8000 });
        await this.firstListItem.click();
        await this.listDoneBtn.click();
        await driver.pause(500);
        console.log(`✅ ${label} selected`);
    }

    async selectFirstBuilding() {
        await this._selectFirstFromListPicker(this.buildingField, 'Building');
    }

    async selectFirstBinTagId() {
        await this._selectFirstFromListPicker(this.unitField, 'Bin Tag ID');
    }

    async selectFirstViolationRule() {
        await this._selectFirstFromListPicker(this.reasonField, 'Violation Rule');
    }

    async selectFirstViolationAction() {
        await this._selectFirstFromListPicker(this.actionField, 'Violation Action');
    }

    // ================================================================
    // ==== Fill Special Note ====
    // ================================================================
    async fillSpecialNote(text) {
        await this.specialNotesField.click();
        await this.specialNotesField.setValue(text);
        await driver.hideKeyboard().catch(() => {});
    }

    // ================================================================
    // ==== Add an image via the in-app camera ====
    // ================================================================
    async addImageViaCamera() {
        await this.addImagesBtn.click();
        await driver.pause(800);
        await this.takePhotoOption.click();
        await driver.pause(1000);

        const allowBtn = await $('android=new UiSelector().resourceId("com.android.permissioncontroller:id/permission_allow_button")');
        if (await allowBtn.isDisplayed().catch(() => false)) {
            await allowBtn.click();
            await driver.pause(1000);
        }

        await this.captureBtn.waitForDisplayed({ timeout: 10000 });
        await this.captureBtn.click();
        await driver.pause(1500);
        await this.cameraNextBtn.click();
        await driver.pause(1500);
        console.log('📷 Image captured and added');
    }

    // ================================================================
    // ==== Submit the form ====
    // ================================================================
    async submitViolation() {
        await this.doneBtn.click();
        await driver.pause(2000);
        console.log('✅ Violation submitted');
    }

    // ================================================================
    // ==== Fill and submit the full manual violation form ====
    // Assumes the target property is already checked in (via Daily Work
    // Plan) — otherwise the app blocks submission with "You must check-in
    // before performing this activity on this property."
    // ================================================================
    async fillAndSubmitManualViolation({ specialNote }) {
        await this.selectFirstProperty();
        await this.selectFirstBuilding();
        await this.selectFirstBinTagId();
        await this.selectFirstViolationRule();
        await this.selectFirstViolationAction();
        await this.addImageViaCamera();
        await this.fillSpecialNote(specialNote);
        await this.submitViolation();
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
