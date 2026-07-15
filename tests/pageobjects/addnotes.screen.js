class AddNotesScreen {

    // ==== Tile on Home Screen ====
    get addNotesTile() { return $('id=com.gwl.trashscan:id/ivAddNotes'); }

    // ==== Notes List Screen (source-verified via live UI dump) ====
    get notesList()   { return $('id=com.gwl.trashscan:id/recyclerview_addNotes'); }
    get noDataText()  { return $('id=com.gwl.trashscan:id/textViewNoData'); }
    get screenTitle() { return $('android=new UiSelector().textContains("Notes")'); }

    // Real "+" add button in the toolbar (an ImageView, not an ImageButton —
    // the old className("android.widget.ImageButton") guess was matching the
    // "Navigate up" back arrow instead, so the form never actually opened).
    get addNoteBtn() { return $('id=com.gwl.trashscan:id/imageview_add'); }

    // ==== Add Note Form Fields (source-verified via live UI dump) ====
    get propertyDropdown()  { return $('id=com.gwl.trashscan:id/txt_property'); }
    get addressLine1()      { return $('id=com.gwl.trashscan:id/editText_address1'); }
    get addressLine2()      { return $('id=com.gwl.trashscan:id/editText_address_2'); }
    get unitField()         { return $('id=com.gwl.trashscan:id/editText_address_unit'); }
    get reasonDropdown()    { return $('id=com.gwl.trashscan:id/spinner_reason'); }
    get addPhotoBtn()       { return $('android=new UiSelector().textContains("Add Photo")'); }
    get noteDescription()   { return $('id=com.gwl.trashscan:id/editText_note_description'); }
    // Real button labels are uppercase ("DONE"/"CANCEL") — the old exact-text
    // selectors looked for "Done"/"Cancel" and never matched.
    get doneBtn()           { return $('id=com.gwl.trashscan:id/text_done'); }
    get cancelBtn()         { return $('id=com.gwl.trashscan:id/text_cancel'); }

    // The reason field is a native android.widget.Spinner — its popup list
    // IS exposed to the accessibility tree, but it can take ~2s to render,
    // and its items are plain TextViews (not CheckedTextView, unlike the
    // property dialog's radio list) — the row 0 is just the "Select Reason"
    // placeholder itself, not a real choice. Verified live on-device.
    get firstRealReasonOption() {
        return $('android=new UiSelector().text("Junk Removal Request")');
    }

    // ==== In-app Camera (same screen used by Violation's Quick Snap) ====
    get cameraSurfaceView() { return $('id=com.gwl.trashscan:id/surface_view'); }
    get cameraCaptureBtn()  { return $('id=com.gwl.trashscan:id/captureButton'); }
    // Post-capture preview confirm — app conventions vary, so match broadly.
    get photoUseConfirmBtn() {
        return $('android=new UiSelector().textMatches("(?i)^(use photo|ok|done|save)$")');
    }

    // ================================================================
    // ==== Open Notes List ====
    // ================================================================
    async openAddNotes() {
        await this.addNotesTile.waitForDisplayed({ timeout: 15000 });
        await this.addNotesTile.click();
        await this.waitForNotesScreen();
    }

    // ================================================================
    // ==== Wait for Screen ====
    // ================================================================
    async waitForNotesScreen() {
        await driver.waitUntil(
            async () => {
                if (await this.notesList.isDisplayed().catch(() => false))   return true;
                if (await this.noDataText.isDisplayed().catch(() => false))  return true;
                if (await this.screenTitle.isDisplayed().catch(() => false)) return true;
                return false;
            },
            { timeout: 20000, timeoutMsg: '❌ Notes screen did not load' }
        );
        console.log('✅ Notes screen loaded');
    }

    // ================================================================
    // ==== Open Add Note Form via the "+" toolbar button ====
    // Opens blank; selectFirstProperty() (called from fillAndSubmitNote)
    // fills in address/unit automatically — don't type into those fields
    // manually, they disappear once a real property is selected.
    // ================================================================
    async openAddNoteForm() {
        await this.addNoteBtn.waitForDisplayed({ timeout: 10000 });
        await this.addNoteBtn.click();
        await this.propertyDropdown.waitForDisplayed({ timeout: 10000 });
        console.log('➕ Add Note form opened');
    }

    // ================================================================
    // ==== Form State ====
    // ================================================================
    async isAddNoteFormVisible() {
        return await this.propertyDropdown.isDisplayed().catch(() => false)
            || await this.doneBtn.isDisplayed().catch(() => false);
    }

    // ================================================================
    // ==== Tap at a percentage of screen size ====
    // "Select Property" is a custom dialog (with its own search box) that
    // renders outside the accessibility tree entirely — verified live: a
    // uiautomator dump while it was on screen returned nothing but a stray
    // progressBar node, even though the dialog was visibly showing a full
    // list. Element selectors can't reach it, so it's driven by coordinate
    // taps measured against the real on-device layout instead.
    // ================================================================
    async _tapByPercent(xPct, yPct) {
        const { width, height } = await driver.getWindowSize();
        await driver.action('pointer')
            .move({ x: Math.round(width * xPct), y: Math.round(height * yPct) })
            .down()
            .up()
            .perform();
    }

    // ================================================================
    // ==== Select first property (custom, non-accessible dialog) ====
    // ================================================================
    async selectFirstProperty() {
        await this.propertyDropdown.click();
        await driver.pause(800);
        await this._tapByPercent(0.43, 0.286); // first property row
        await driver.pause(500);
        await this._tapByPercent(0.70, 0.835); // dialog's own Done button
        await driver.pause(500);
        console.log('✅ Property selected');
    }

    // ================================================================
    // ==== Select first reason (native Spinner — accessible) ====
    // ================================================================
    async selectFirstReason() {
        await this.reasonDropdown.click();
        try {
            // Popup can take ~2s to render — give it real margin.
            await this.firstRealReasonOption.waitForDisplayed({ timeout: 8000 });
            await this.firstRealReasonOption.click();
            console.log('✅ Reason selected (Junk Removal Request)');
            return true;
        } catch {
            console.log('⚠️ Reason dropdown did not present a list — leaving unselected');
            return false;
        }
    }

    // ================================================================
    // ==== Tap Add Photo, grant camera permission if prompted, and
    // actually capture a photo via the in-app camera ====
    // ================================================================
    async _returnToForm() {
        for (let i = 0; i < 4; i++) {
            if (await this.noteDescription.isDisplayed().catch(() => false)) return true;
            await driver.back().catch(() => {});
            await driver.pause(800);
        }
        return await this.noteDescription.isDisplayed().catch(() => false);
    }

    async tapAddPhotoAndCapture() {
        await this.addPhotoBtn.click();
        await driver.pause(1000);

        const allowBtn = await $('android=new UiSelector().resourceId("com.android.permissioncontroller:id/permission_allow_button")');
        if (await allowBtn.isDisplayed().catch(() => false)) {
            await allowBtn.click();
            await driver.pause(1000);
        }

        const inCamera = await this.cameraSurfaceView.isDisplayed().catch(() => false)
            || await this.cameraCaptureBtn.isDisplayed().catch(() => false);
        if (!inCamera) {
            console.log('⚠️ Add Photo did not open the camera — backing out without capturing');
            await this._returnToForm();
            return;
        }

        await this.cameraCaptureBtn.waitForDisplayed({ timeout: 10000 });
        await this.cameraCaptureBtn.click();
        await driver.pause(1500);

        if (await this.photoUseConfirmBtn.isDisplayed().catch(() => false)) {
            await this.photoUseConfirmBtn.click();
            await driver.pause(1000);
        }

        await this._returnToForm();
        console.log('📷 Photo captured');
    }

    // ================================================================
    // ==== Fill and submit a full note ====
    // Property selection auto-fills address/unit — don't type into those
    // fields manually, they disappear once a real property is selected.
    // ================================================================
    async fillAndSubmitNote({ description }) {
        await this.selectFirstProperty();

        await this.selectFirstReason();

        await this.tapAddPhotoAndCapture();

        await this.noteDescription.click();
        await this.noteDescription.setValue(description);

        await this.doneBtn.click();
        await driver.pause(1500);
        console.log('✅ Note submitted');
    }

    // ================================================================
    // ==== Cancel Form ====
    // ================================================================
    async cancelAddNote() {
        try {
            if (await this.cancelBtn.isDisplayed().catch(() => false)) {
                await this.cancelBtn.click();
                console.log('❌ Add Note form cancelled');
            } else {
                await driver.back();
            }
        } catch {
            await driver.back();
        }
        await driver.pause(800);
    }
}

module.exports = new AddNotesScreen();
