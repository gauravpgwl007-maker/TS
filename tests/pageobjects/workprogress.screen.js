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

    get emptyStateText() {
        return $('android=new UiSelector().textContains("No")');
    }

    // ================================================================
    // ==== Property Actions ====
    // ================================================================

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
    // ==== Open Work Progress ====
    // ================================================================

    async openWorkProgress() {

        console.log('⏳ Waiting for Work Progress tile...');

        await this.workProgressTile.waitForDisplayed({
            timeout: 20000
        });

        console.log('👉 Clicking Work Progress tile');

        await this.workProgressTile.click();

        await this.recyclerView.waitForDisplayed({
            timeout: 20000
        });

        console.log('✅ Work Progress screen loaded');

        await driver.pause(3000);
    }

    // ================================================================
    // ==== Expand Property & Find Check-In ====
    // ================================================================

    async expandAvailableProperty() {

        console.log('⏳ Waiting for property dropdowns...');

        await driver.pause(5000);

        // ============================================================
        // First Property
        // ============================================================

        const firstDropdown = await $(
            'android=new UiSelector().resourceId("com.gwl.trashscan:id/iv_buttonExpandCollapse").instance(0)'
        );

        await firstDropdown.waitForDisplayed({
            timeout: 15000
        });

        console.log('👉 Expanding first property');

        await firstDropdown.click();

        await driver.pause(3000);

        const checkInVisible =
            await this.checkInButton.isDisplayed().catch(() => false);

        if (checkInVisible) {

            console.log('✅ Check-In available in first property');

            return;
        }

        console.log('ℹ️ Check-In not available in first property');

        // Collapse first property
        await firstDropdown.click();

        await driver.pause(2000);

        // ============================================================
        // Second Property
        // ============================================================

        const secondDropdown = await $(
            'android=new UiSelector().resourceId("com.gwl.trashscan:id/iv_buttonExpandCollapse").instance(1)'
        );

        await secondDropdown.waitForDisplayed({
            timeout: 10000
        });

        console.log('👉 Expanding second property');

        await secondDropdown.click();

        await driver.pause(3000);

        console.log('✅ Second property expanded');
    }

    // ================================================================
    // ==== Click Check-In ====
    // ================================================================

    async clickCheckIn() {

        await this.checkInButton.waitForDisplayed({
            timeout: 15000
        });

        await this.checkInButton.click();

        console.log('👉 Clicked Check-In button');

        await driver.pause(2000);
    }

    // ================================================================
    // ==== Submit Reason ====
    // ================================================================

    async enterReasonAndSubmit(reason) {

        await driver.hideKeyboard().catch(() => {});

        await this.reasonInput.waitForDisplayed({
            timeout: 10000
        });

        await this.reasonInput.setValue(reason);

        await this.submitButton.waitForDisplayed({
            timeout: 10000
        });

        await this.submitButton.click();

        console.log(`✅ Submitted reason: ${reason}`);

        await driver.pause(3000);
    }

    // ================================================================
    // ==== Validation Helpers ====
    // ================================================================

    async hasProperties() {

        const count = await this.propertyItems.length;

        console.log(`ℹ️ Property count: ${count}`);

        return count > 0;
    }

    async isEmptyState() {

        return await this.emptyStateText
            .isDisplayed()
            .catch(() => false);
    }

    // ================================================================
    // ==== Complete Check-In Flow ====
    // ================================================================

    async completeCheckInFlow(reason) {

        await this.openWorkProgress();

        await this.expandAvailableProperty();

        await this.clickCheckIn();

        await this.enterReasonAndSubmit(reason);

        console.log('🚀 Full Check-In Flow Completed');
    }

    // ================================================================
    // ==== Optional Popup Handler ====
    // ================================================================

    async _submitReasonIfPresent(reason) {

        try {

            await driver.hideKeyboard().catch(() => {});

            await this.reasonInput.waitForDisplayed({
                timeout: 5000
            });

            await this.reasonInput.setValue(reason);

            await this.submitButton.waitForDisplayed({
                timeout: 3000
            });

            await this.submitButton.click();

            console.log(`✅ Reason submitted: ${reason}`);

        } catch {

            console.log('ℹ️ No reason popup appeared — continuing');
        }
    }
}

module.exports = new WorkProgressScreen();