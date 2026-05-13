class ViolationScreen {

    // ================================================================
    // ==== Tile on Home Screen ====
    // ================================================================

    get violationTile() {
        return $('id=com.gwl.trashscan:id/ivViolation');
    }

    // ================================================================
    // ==== Violation Option Dialog ====
    // ================================================================

    get manualOption() {
        return $('id=com.gwl.trashscan:id/buttonManully');
    }

    get scanViewOption() {
        return $('id=com.gwl.trashscan:id/buttonScan');
    }

    get quickSnapOption() {
        return $('id=com.gwl.trashscan:id/buttonQuickSnap');
    }

    get dialogTitle() {
        return $('android=new UiSelector().textContains("Choose Violation")');
    }

    // ================================================================
    // ==== Manual Violation Form ====
    // ================================================================

    get propertyField() {
        return $('id=com.gwl.trashscan:id/txt_property');
    }

    get buildingField() {
        return $('id=com.gwl.trashscan:id/txt_building');
    }

    get unitField() {
        return $('id=com.gwl.trashscan:id/txt_unit');
    }

    get reasonField() {
        return $('id=com.gwl.trashscan:id/txt_reason');
    }

    get actionField() {
        return $('id=com.gwl.trashscan:id/txt_action');
    }

    get specialNotesField() {
        return $('id=com.gwl.trashscan:id/special_note_et');
    }

    get doneBtn() {
        return $('id=com.gwl.trashscan:id/text_done');
    }

    get backArrow() {
        return $('id=com.gwl.trashscan:id/backArrow');
    }

    // ================================================================
    // ==== Popup Dialog ====
    // ================================================================

    get dialogDoneBtn() {
        return $('android=new UiSelector().text("Done")');
    }

    // ================================================================
    // ==== Scanner / Camera ====
    // ================================================================

    get scannerView() {
        return $('id=com.gwl.trashscan:id/surface_view');
    }

    get captureBtn() {
        return $('id=com.gwl.trashscan:id/captureButton');
    }

    get activityLogsBar() {
        return $('id=com.gwl.trashscan:id/tv_activity_log_view');
    }

    // ================================================================
    // ==== Open Violation Tile ====
    // ================================================================

    async openViolation() {

        await this.violationTile.waitForDisplayed({
            timeout: 15000
        });

        console.log('👉 Clicking Violation tile...');

        await this.violationTile.click();
    }

    // ================================================================
    // ==== Wait For Dialog ====
    // ================================================================

    async waitForDialog() {

        await driver.waitUntil(
            async () => {

                if (await this.manualOption.isDisplayed().catch(() => false)) {
                    return true;
                }

                if (await this.dialogTitle.isDisplayed().catch(() => false)) {
                    return true;
                }

                return false;

            },
            {
                timeout: 15000,
                interval: 1000,
                timeoutMsg: '❌ Violation option dialog did not appear'
            }
        );

        console.log('📋 Violation option dialog visible');
    }

    // ================================================================
    // ==== Open Manual Violation ====
    // ================================================================

    async openViolationManual() {

        await this.openViolation();

        await this.waitForDialog();

        await this.manualOption.click();

        await this.propertyField.waitForDisplayed({
            timeout: 15000
        });

        console.log('✅ Manual Violation form loaded');
    }

    // ================================================================
    // ==== Select First Option From Popup ====
    // ================================================================

    async pickFirstAndConfirm() {

        await driver.pause(2000);

        const firstItem =
            $('android=new UiSelector().className("android.widget.TextView").instance(1)');

        await firstItem.waitForDisplayed({
            timeout: 10000
        });

        const text = await firstItem.getText();

        await firstItem.click();

        console.log(`✅ Selected option: ${text}`);

        await this.dialogDoneBtn.waitForDisplayed({
            timeout: 5000
        });

        await this.dialogDoneBtn.click();

        await driver.pause(1500);

        return text;
    }

    // ================================================================
    // ==== Complete Manual Violation ====
    // ================================================================

    async submitManualViolation() {

        await this.openViolationManual();

        //
        // Property
        //
        console.log('👉 Selecting Property...');

        await this.propertyField.click();

        await this.pickFirstAndConfirm();

        //
        // Building
        //
        console.log('👉 Selecting Building...');

        await this.buildingField.click();

        await this.pickFirstAndConfirm();

        //
        // Bin Tag
        //
        console.log('👉 Selecting Bin Tag...');

        await this.unitField.click();

        await this.pickFirstAndConfirm();

        //
        // Violation Rule
        //
        console.log('👉 Selecting Violation Rule...');

        await this.reasonField.click();

        await this.pickFirstAndConfirm();

        //
        // Action
        //
        console.log('👉 Selecting Violation Action...');

        await this.actionField.click();

        await this.pickFirstAndConfirm();

        //
        // Special Note
        //
        console.log('👉 Entering Special Note...');

        await this.specialNotesField.waitForDisplayed({
            timeout: 5000
        });

        await this.specialNotesField.setValue('Test');

        //
        // Add Image
        //
        console.log('👉 Adding Image...');

        const addImageBtn =
            $('android=new UiSelector().textContains("Add Images")');

        await addImageBtn.waitForDisplayed({
            timeout: 10000
        });

        await addImageBtn.click();

        //
        // Take Photo
        //
        const takePhotoBtn =
            $('android=new UiSelector().textContains("Take Photo")');

        await takePhotoBtn.waitForDisplayed({
            timeout: 10000
        });

        await takePhotoBtn.click();

        //
        // Camera Capture
        //
        const shutterBtn =
            $('android=new UiSelector().resourceId("com.android.camera:id/shutter_button")');

        await shutterBtn.waitForDisplayed({
            timeout: 15000
        });

        await shutterBtn.click();

        console.log('📸 Photo captured');

        await driver.pause(4000);

        //
        // Next Button
        //
        const nextBtn =
            $('android=new UiSelector().textContains("Next")');

        if (await nextBtn.isDisplayed().catch(() => false)) {

            await nextBtn.click();

            console.log('➡️ Next clicked');
        }

        await driver.pause(3000);

        //
        // Final Done
        //
        console.log('👉 Clicking Final Done...');

        await this.doneBtn.waitForDisplayed({
            timeout: 10000
        });

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

                if (await this.scannerView.isDisplayed().catch(() => false)) {
                    return true;
                }

                if (await this.activityLogsBar.isDisplayed().catch(() => false)) {
                    return true;
                }

                return false;

            },
            {
                timeout: 15000,
                timeoutMsg: '❌ Scan View screen did not load'
            }
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

                if (await this.captureBtn.isDisplayed().catch(() => false)) {
                    return true;
                }

                if (await this.scannerView.isDisplayed().catch(() => false)) {
                    return true;
                }

                return false;

            },
            {
                timeout: 15000,
                timeoutMsg: '❌ Quick Snap screen did not load'
            }
        );

        console.log('✅ Quick Snap opened');
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

        await driver.pause(1000);

        for (const label of ['Discard', 'Yes', 'Leave', 'OK']) {

            try {

                const btn =
                    $(`android=new UiSelector().text("${label}")`);

                if (await btn.isDisplayed().catch(() => false)) {

                    await btn.click();

                    break;
                }

            } catch {

                // Ignore
            }
        }

        await driver.pause(1000);
    }
}

module.exports = new ViolationScreen();