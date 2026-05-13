// workprogress.screen.js
const HomeScreen = require('./home.screen');

class WorkProgressScreen {

    // ================================================================
    // ==== Home Screen ====
    // ================================================================

    get workProgressTile() {
        return $('id=com.gwl.trashscan:id/ll_work_progress');
    }

    // ================================================================
    // ==== Work Progress Screen ====
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
    // ==== Property Actions ====
    // ================================================================

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
        return $('android=new UiSelector().resourceId("com.gwl.trashscan:id/edtMessage")');
    }

    get submitButton() {
        return $('android=new UiSelector().resourceId("com.gwl.trashscan:id/buttonSubmit")');
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

        console.log('👉 Clicking Work Progress tile');

        await this.workProgressTile.click();

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

        console.log(`🔍 Searched property: ${propertyName}`);
    }

    async expandFirstPropertyDropdown() {

        await this.expandDropdownBtn.waitForDisplayed({
            timeout: 10000
        });

        await this.expandDropdownBtn.click();

        console.log('⬇️ Expanded first property dropdown');
    }

    async clickCheckIn() {

        await this.checkInButton.waitForDisplayed({
            timeout: 15000
        });

        await this.checkInButton.click();

        console.log('👉 Clicked Check-In button');
    }

    async enterReasonAndSubmit(reason) {

        await driver.hideKeyboard().catch(() => {});

        await this.reasonInput.waitForDisplayed({
            timeout: 10000
        });

        await this.reasonInput.setValue(reason);

        await this.submitButton.click();

        console.log('✅ Submitted check-in reason');
    }

    // ================================================================
    // ==== Complete Flow ====
    // ================================================================

    async completeCheckInFlow(propertyName, reason) {

        await this.openWorkProgress();

        await this.searchProperty(propertyName);

        await driver.pause(1500);

        await this.expandFirstPropertyDropdown();

        await this.clickCheckIn();

        await this.enterReasonAndSubmit(reason);

        console.log('🚀 Full Check-In Flow Completed');
    }

    // Handles optional reason popup — if the popup doesn't appear, moves on
    async _submitReasonIfPresent(reason) {
        try {
            await driver.hideKeyboard().catch(() => {});
            await this.reasonInput.waitForDisplayed({ timeout: 5000 });
            await this.reasonInput.setValue(reason);
            await this.submitButton.waitForDisplayed({ timeout: 3000 });
            await this.submitButton.click();
            console.log(`✅ Reason submitted: ${reason}`);
        } catch {
            console.log('ℹ️ No reason popup appeared — continuing');
        }
    }

    // ================================================================
    // ==== Check-In AND Check-Out Flow (called by workprogress.spec.js)
    // ================================================================

    async completeWorkProgressFlow() {

        // --- Phase 1: Check-In ---
        console.log('⏳ Starting Check-In phase...');
        await this.openWorkProgress();
        await this.expandFirstPropertyDropdown();
        await this.clickCheckIn();
        await this._submitReasonIfPresent('Automation Check-In Test');
        await driver.pause(2000);
        console.log('✅ Check-In phase complete');

        // --- Return to Home then re-open Work Progress for Check-Out ---
        await HomeScreen.waitForHomeScreen();

        // --- Phase 2: Check-Out ---
        console.log('⏳ Starting Check-Out phase...');
        await this.openWorkProgress();
        await this.expandFirstPropertyDropdown();
        await this.clickCheckIn(); // same button ID toggles between Check-In / Check-Out
        await this._submitReasonIfPresent('Automation Check-Out Test');
        await driver.pause(2000);
        console.log('✅ Check-Out phase complete');

        // Leave app on Home screen for next spec
        await HomeScreen.waitForHomeScreen();
        console.log('🎉 Work Progress Check-In & Check-Out flow completed');
    }
}

module.exports = new WorkProgressScreen();