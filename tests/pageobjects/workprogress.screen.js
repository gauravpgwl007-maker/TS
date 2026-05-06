class WorkProgressScreen {

    // ==== Tile on Home Screen ====
    get workProgressTile() { 
        return $('id=com.gwl.trashscan:id/ll_work_progress'); 
    }

    // ==== Work Progress List ====
    get recyclerView() {
        return $('id=com.gwl.trashscan:id/recyclerView');
    }

    get propertyItems() {
        return $$('id=com.gwl.trashscan:id/parent_cv_assigned_list');
    }

    // ==== Search ====
    get searchIcon() {
        return $('android=new UiSelector().descriptionContains("Search")');
    }

    get searchInput() {
        return $('id=com.gwl.trashscan:id/search_src_text');
    }

    // ==== Expand Property Dropdown ====
    get expandDropdownBtn() {
        return $('android=new UiSelector().resourceId("com.gwl.trashscan:id/iv_buttonExpandCollapse").instance(0)');
    }

    // ==== Check In Button (inside expanded card) ====
    get checkInButton() {
        return $('android=new UiSelector().resourceId("com.gwl.trashscan:id/btn_buttonCheckInCheckOut")');
    }

    // ==== Popup (NEW correct locators) ====
    get reasonInput() {
        return $('android=new UiSelector().resourceId("com.gwl.trashscan:id/edtMessage")');
    }

    get submitButton() {
        return $('android=new UiSelector().resourceId("com.gwl.trashscan:id/buttonSubmit")');
    }

    // ================================================================
    // ==== Actions ====
    // ================================================================

    async openWorkProgress() {
        await this.workProgressTile.waitForDisplayed({ timeout: 15000 });
        await this.workProgressTile.click();

        await this.recyclerView.waitForDisplayed({ timeout: 20000 });
        console.log('✅ Work Progress screen loaded');
    }

    async searchProperty(text) {
        await this.searchIcon.waitForDisplayed({ timeout: 10000 });
        await this.searchIcon.click();

        await this.searchInput.waitForDisplayed({ timeout: 10000 });
        await this.searchInput.setValue(text);

        console.log(`🔍 Searched for: ${text}`);
    }

    async expandFirstPropertyDropdown() {
        await this.expandDropdownBtn.waitForDisplayed({ timeout: 10000 });
        await this.expandDropdownBtn.click();

        console.log('⬇️ Property dropdown expanded');
    }

    async clickCheckIn() {
        await this.checkInButton.waitForDisplayed({ timeout: 15000 });
        await this.checkInButton.click();

        console.log('👉 Check In clicked');
    }

    async enterReasonAndSubmit(reason) {
        await driver.hideKeyboard().catch(() => {});

        await this.reasonInput.waitForDisplayed({ timeout: 10000 });
        await this.reasonInput.setValue(reason);

        await this.submitButton.click();

        console.log('✅ Reason submitted');
    }

    // ================================================================
    // ==== FULL FLOW METHOD (Recommended) ====
    // ================================================================

    async completeCheckInFlow(propertyName, reason) {
        await this.openWorkProgress();

        await this.searchProperty(propertyName);

        await driver.pause(1000); // allow filter to apply

        await this.expandFirstPropertyDropdown();

        await this.clickCheckIn();

        await this.enterReasonAndSubmit(reason);

        console.log('🚀 Full Check-In Flow Completed');
    }
}

module.exports = new WorkProgressScreen();