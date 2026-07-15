class WorkProgressScreen {

    // ==== Tile on Home Screen ====
    get workProgressTile() { return $('id=com.gwl.trashscan:id/ll_work_progress'); }

    // ==== Porter Work Progress (source-verified via live UI dump: accordion-style rows) ====
    get recyclerView()      { return $('id=com.gwl.trashscan:id/recyclerView'); }
    get noRecordView()      { return $('id=com.gwl.trashscan:id/tv_noRecordView'); }

    // ==== Property List Items ====
    // Each row is a collapsed accordion header (property name + expand/collapse
    // chevron). Expanding it reveals the Check In/Out button inline — there is
    // no separate "property detail" screen to navigate to.
    get firstPropertyRow()  { return $('id=com.gwl.trashscan:id/cv_propertyDetailsContainer'); }
    get firstPropertyName() { return $('id=com.gwl.trashscan:id/tv_propertyName'); }
    get firstExpandCollapseBtn() { return $('id=com.gwl.trashscan:id/iv_buttonExpandCollapse'); }

    // ==== Expanded Row Contents ====
    get checkInOutBtn()  { return $('id=com.gwl.trashscan:id/btn_buttonCheckInCheckOut'); }
    get checkInTime()    { return $('id=com.gwl.trashscan:id/tv_checkInTime'); }

    // ==== Screen Identifiers ====
    get screenTitle()      { return $('android=new UiSelector().textContains("Work Progress")'); }
    get screenIdentifier() { return $('android=new UiSelector().textContains("Progress")'); }

    // ================================================================
    // ==== Open Work Progress ====
    // ================================================================
    async openWorkProgress() {
        await this.workProgressTile.waitForDisplayed({ timeout: 15000 });
        await this.workProgressTile.click();
        await this.waitForWorkProgressScreen();
    }

    // ================================================================
    // ==== Wait for Screen ====
    // ================================================================
    async waitForWorkProgressScreen() {
        await driver.waitUntil(
            async () => {
                if (await this.recyclerView.isDisplayed().catch(() => false))      return true;
                if (await this.noRecordView.isDisplayed().catch(() => false))      return true;
                if (await this.firstPropertyRow.isDisplayed().catch(() => false))  return true;
                if (await this.screenTitle.isDisplayed().catch(() => false))       return true;
                // Admin service report fallback
                if (await $('id=com.gwl.trashscan:id/recyclerviewList').isDisplayed().catch(() => false)) return true;
                if (await $('id=com.gwl.trashscan:id/textViewNoData').isDisplayed().catch(() => false))   return true;
                return false;
            },
            { timeout: 20000, timeoutMsg: '❌ Work Progress screen did not load' }
        );
        console.log('✅ Work Progress screen loaded');
    }

    // ================================================================
    // ==== State Checks ====
    // ================================================================
    async hasProperties() {
        return await this.firstPropertyRow.isDisplayed().catch(() => false)
            || await this.recyclerView.isDisplayed().catch(() => false);
    }

    async isEmptyState() {
        return await this.noRecordView.isDisplayed().catch(() => false)
            || await $('id=com.gwl.trashscan:id/textViewNoData').isDisplayed().catch(() => false);
    }

    // ================================================================
    // ==== Expand First Property Row ====
    // ================================================================
    async openFirstProperty() {
        try {
            await this.firstExpandCollapseBtn.waitForDisplayed({ timeout: 10000 });
            await this.firstExpandCollapseBtn.click();
            console.log('📋 First property row expanded');
            await this.checkInOutBtn.waitForDisplayed({ timeout: 8000 });
        } catch {
            console.log('⚠️ No property item available to expand');
        }
    }

    // ================================================================
    // ==== Perform Check In (only if not already checked in) ====
    // ================================================================
    async performCheckIn() {
        const visible = await this.checkInOutBtn.isDisplayed().catch(() => false);
        if (!visible) {
            console.log('ℹ️ Check In/Out button not visible — skipping');
            return false;
        }

        const label = await this.checkInOutBtn.getText().catch(() => '');
        if (!/check in/i.test(label)) {
            console.log(`ℹ️ Property button shows "${label}" — already checked in, skipping`);
            return false;
        }

        await this.checkInOutBtn.click();
        await driver.pause(1500);
        console.log('✅ Property Check In performed');
        return true;
    }
}

module.exports = new WorkProgressScreen();
