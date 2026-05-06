class DailyWorkPlanScreen {

    // ==== Tile on Home Screen ====
    get dailyWorkPlanTile() { return $('id=com.gwl.trashscan:id/ivAddSubs'); }

    // ==== Daily Work Plan Screen (source-verified: activity_daily_work_plan.xml) ====
    get screenTitle()     { return $('id=com.gwl.trashscan:id/textView_dailyWorkPlan'); }
    get checkInBtn()      { return $('id=com.gwl.trashscan:id/tv_CheckIn'); }
    get listViewBtn()     { return $('id=com.gwl.trashscan:id/imageViewList'); }
    get mapViewBtn()      { return $('id=com.gwl.trashscan:id/imageViewMap'); }
    get progressBar()     { return $('id=com.gwl.trashscan:id/progressBar'); }
    get screenIdentifier(){ return $('android=new UiSelector().textContains("Work Plan")'); }

    // ================================================================
    // ==== Open Daily Work Plan ====
    // ================================================================
    async openDailyWorkPlan() {
        await this.dailyWorkPlanTile.waitForDisplayed({ timeout: 15000 });
        await this.dailyWorkPlanTile.click();
        await this.waitForDailyWorkPlanScreen();
    }

    // ================================================================
    // ==== Wait for Screen ====
    // ================================================================
    async waitForDailyWorkPlanScreen() {
        await driver.waitUntil(
            async () => {
                if (await this.screenTitle.isDisplayed().catch(() => false))      return true;
                if (await this.checkInBtn.isDisplayed().catch(() => false))       return true;
                if (await this.listViewBtn.isDisplayed().catch(() => false))      return true;
                if (await this.screenIdentifier.isDisplayed().catch(() => false)) return true;
                return false;
            },
            { timeout: 20000, timeoutMsg: '❌ Daily Work Plan screen did not load' }
        );
        console.log('✅ Daily Work Plan screen loaded');
    }
}

module.exports = new DailyWorkPlanScreen();
