class ActivityLogsScreen {

    // ==== Tile on Home Screen ====
    get activityLogsTile() { return $('id=com.gwl.trashscan:id/ivRollback'); }

    // ==== Activity Logs Screen (source-verified: activity_active_log.xml) ====
    get recyclerView()  { return $('id=com.gwl.trashscan:id/recyclerview_activity_log'); }
    get noRecordsText() { return $('id=com.gwl.trashscan:id/textViewNoRecords'); }
    get progressBar()   { return $('id=com.gwl.trashscan:id/progress_bar'); }
    get screenTitle()   { return $('android=new UiSelector().textContains("Activity Logs")'); }

    // First item inside the recycler
    get firstLogItem() {
        return $('android=new UiSelector().resourceId("com.gwl.trashscan:id/recyclerview_activity_log").childSelector(new UiSelector().instance(0))');
    }

    // ================================================================
    // ==== Open Activity Logs ====
    // ================================================================
    async openActivityLogs() {
        await this.activityLogsTile.waitForDisplayed({ timeout: 15000 });
        await this.activityLogsTile.click();
        await this.waitForActivityLogsScreen();
    }

    // ================================================================
    // ==== Wait for Screen ====
    // ================================================================
    async waitForActivityLogsScreen() {
        await driver.waitUntil(
            async () => {
                if (await this.recyclerView.isDisplayed().catch(() => false))  return true;
                if (await this.noRecordsText.isDisplayed().catch(() => false)) return true;
                if (await this.screenTitle.isDisplayed().catch(() => false))   return true;
                return false;
            },
            { timeout: 20000, timeoutMsg: '❌ Activity Logs screen did not load' }
        );
        console.log('✅ Activity Logs screen loaded');
    }

    // ================================================================
    // ==== State Checks ====
    // ================================================================
    async hasLogs() {
        return await this.recyclerView.isDisplayed().catch(() => false);
    }

    async isEmptyState() {
        return await this.noRecordsText.isDisplayed().catch(() => false);
    }

    async getFirstLogText() {
        try {
            return await this.firstLogItem.getText();
        } catch {
            return null;
        }
    }
}

module.exports = new ActivityLogsScreen();
