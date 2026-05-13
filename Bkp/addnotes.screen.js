class AddNotesScreen {

    // ==== Tile on Home Screen ====
    get addNotesTile() { return $('id=com.gwl.trashscan:id/ivAddNotes'); }

    // ==== Notes List Screen (source-verified: activity_add_note.xml) ====
    get notesList()   { return $('id=com.gwl.trashscan:id/recyclerview_addNotes'); }
    get noDataText()  { return $('id=com.gwl.trashscan:id/textViewNoData'); }
    get progressBar() { return $('id=com.gwl.trashscan:id/progress_bar'); }
    get screenTitle() { return $('android=new UiSelector().textContains("Notes")'); }

    // "+" add button in the top-right toolbar — primary and fallback locators
    get addNoteBtn()    { return $('android=new UiSelector().className("android.widget.ImageButton").descriptionContains("Add")'); }
    get addNoteBtnAlt() { return $('android=new UiSelector().className("android.widget.ImageView").descriptionContains("Add")'); }

    // ==== Add Note Form Fields (source-verified from screenshot) ====
    get propertyDropdown() { return $('android=new UiSelector().textContains("Select Property")'); }
    get reasonDropdown()   { return $('android=new UiSelector().textContains("Select Reason")'); }
    get addPhotoBtn()      { return $('android=new UiSelector().textContains("Add Photo")'); }
    get doneBtn()          { return $('android=new UiSelector().text("Done")'); }
    get cancelBtn()        { return $('android=new UiSelector().text("Cancel")'); }

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
    // ==== Open Add Note Form ====
    // ================================================================
    async openAddNoteForm() {
        if (await this.addNoteBtn.isDisplayed().catch(() => false)) {
            await this.addNoteBtn.click();
            console.log('➕ Add Note form opened via ImageButton');
            await driver.pause(1000);
            return;
        }
        if (await this.addNoteBtnAlt.isDisplayed().catch(() => false)) {
            await this.addNoteBtnAlt.click();
            console.log('➕ Add Note form opened via ImageView');
            await driver.pause(1000);
            return;
        }
        // Last resort: tap the "+" text if rendered as a TextView
        try {
            const plusEl = await $('android=new UiSelector().text("+")');
            if (await plusEl.isDisplayed().catch(() => false)) {
                await plusEl.click();
                console.log('➕ Add Note form opened via + text');
                await driver.pause(1000);
                return;
            }
        } catch {}
        console.log('⚠️ Add Note button not found — form cannot be opened');
    }

    // ================================================================
    // ==== Form State ====
    // ================================================================
    async isAddNoteFormVisible() {
        return await this.propertyDropdown.isDisplayed().catch(() => false)
            || await this.doneBtn.isDisplayed().catch(() => false);
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
