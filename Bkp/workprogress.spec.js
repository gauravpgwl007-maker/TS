class WorkProgressScreen {

    // ================================================================
    // ==== Home Tile ====
    // ================================================================

    get workProgressTile() {
        return $('id=com.gwl.trashscan:id/ll_work_progress');
    }

    // ================================================================
    // ==== Main List ====
    // ================================================================

    get recyclerView() {
        return $('id=com.gwl.trashscan:id/recyclerView');
    }

    get propertyItems() {
        return $$('id=com.gwl.trashscan:id/parent_cv_assigned_list');
    }

    // ================================================================
    // ==== Search ====
    // ================================================================

    get searchIcon() {
        return $('~Search');
    }

    get searchInput() {
        return $('id=com.gwl.trashscan:id/search_src_text');
    }

    // ================================================================
    // ==== Property / Building ====
    // ================================================================

    get firstPropertyCard() {
        return $('android=new UiSelector().resourceId("com.gwl.trashscan:id/parent_cv_assigned_list").instance(0)');
    }

    get expandDropdownBtn() {
        return $('android=new UiSelector().resourceId("com.gwl.trashscan:id/iv_buttonExpandCollapse").instance(0)');
    }

    get checkInButton() {
        return $('android=new UiSelector().resourceId("com.gwl.trashscan:id/btn_buttonCheckInCheckOut")');
    }

    // ================================================================
    // ==== Popup ====
    // ================================================================

    get reasonInput() {
        return $('id=com.gwl.trashscan:id/edtMessage');
    }

    get submitButton() {
        return $('id=com.gwl.trashscan:id/buttonSubmit');
    }

    // ================================================================
    // ==== Actions ====
    // ================================================================

    async openWorkProgress() {

        console.log('⏳ Waiting for Work Progress tile...');

        await this.workProgressTile.waitForExist({
            timeout: 20000
        });

        await this.workProgressTile.waitForDisplayed({
            timeout: 20000
        });

        await this.workProgressTile.click();

        console.log('👉 Opened Work Progress');

        await this.recyclerView.waitForDisplayed({
            timeout: 20000
        });

        console.log('✅ Work Progress screen loaded');
    }

    async searchProperty(propertyName) {

        await this.searchIcon.waitForDisplayed({
            timeout: 10000
        });

        await this.searchIcon.click();

        await this.searchInput.waitForDisplayed({
            timeout: 10000
        });

        await this.searchInput.setValue(propertyName);

        console.log(`🔍 Searched Property: ${propertyName}`);

        await driver.pause(1500);
    }

    // ================================================================
    // ==== NEW METHOD ====
    // ================================================================

    async openFirstProperty() {

        await this.firstPropertyCard.waitForDisplayed({
            timeout: 15000
        });

        await this.firstPropertyCard.click();

        console.log('🏢 First property opened');

        await driver.pause(1000);
    }

    // ================================================================
    // ==== NEW METHOD ====
    // ================================================================

    async expandFirstBuildingIfPresent() {

        const isDisplayed = await this.expandDropdownBtn.isDisplayed()
            .catch(() => false);

        if (isDisplayed) {

            await this.expandDropdownBtn.click();

            console.log('⬇️ Building dropdown expanded');

            await driver.pause(1000);

        } else {

            console.log('ℹ️ No building dropdown found');
        }
    }

    async clickCheckIn() {

        await this.checkInButton.waitForDisplayed({
            timeout: 15000
        });

        await this.checkInButton.click();

        console.log('👉 Check-In button clicked');
    }

    async enterReasonAndSubmit(reason) {

        const popupVisible = await this.reasonInput.isDisplayed()
            .catch(() => false);

        if (popupVisible) {

            await this.reasonInput.setValue(reason);

            await driver.hideKeyboard().catch(() => {});

            await this.submitButton.click();

            console.log('✅ Reason submitted');

        } else {

            console.log('ℹ️ No reason popup appeared');
        }
    }
}

module.exports = new WorkProgressScreen();