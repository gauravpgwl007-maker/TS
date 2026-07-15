class DailyWorkPlanScreen {

    // ==== Tile on Home Screen ====
    // ivAddSubs was opening Assigned Property List (Work Progress), not Daily Work Plan.
    // Text-based selector targets the correct tile label.
    get dailyWorkPlanTile() { return $('android=new UiSelector().text("Daily Work Plan")'); }

    // ==== Assigned Property List (source-verified via live UI dump — this is
    // the real Daily Work Plan screen; the old textView_dailyWorkPlan/tv_CheckIn
    // selectors here never matched anything real) ====
    get propertyList()      { return $('id=com.gwl.trashscan:id/recyclerview_assigned_property'); }
    get firstPropertyRow()  { return $('id=com.gwl.trashscan:id/parent_cv_assigned_list'); }
    get firstPropertyName() { return $('id=com.gwl.trashscan:id/assignedproperty_name'); }

    // ==== "Property CheckOut" missed-checkout dialog ====
    // Simply opening a property's detail screen is what performs check-in —
    // there's no separate toggle button. But if a previous day's checkout
    // was missed, this dialog blocks entry until a reason is submitted.
    // Confirmed live on-device.
    get propertyCheckoutReasonField() { return $('android=new UiSelector().className("android.widget.EditText")'); }
    get propertyCheckoutSubmitBtn()   { return $('android=new UiSelector().text("Submit")'); }

    // ==== Property Detail Screen (Task List / Buildings) ====
    get viewTaskBtn()         { return $('id=com.gwl.trashscan:id/mTextview_btn_view_task'); }
    get propertyCheckoutBtn() { return $('id=com.gwl.trashscan:id/mTextview_btn_property_checkout'); }
    get serviceNoteBtn()      { return $('id=com.gwl.trashscan:id/mTextview_btn_service_note'); }
    get buildingsList()       { return $('id=com.gwl.trashscan:id/recyclerview_dailyWorkPlanBuildingList'); }
    get firstBuildingRow()    { return $('id=com.gwl.trashscan:id/buildingNameView'); }

    // ================================================================
    // ==== Open Daily Work Plan (Assigned Property List) ====
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
                if (await this.propertyList.isDisplayed().catch(() => false))     return true;
                if (await this.firstPropertyRow.isDisplayed().catch(() => false)) return true;
                return false;
            },
            { timeout: 30000, timeoutMsg: '❌ Daily Work Plan screen did not load' }
        );
        console.log('✅ Daily Work Plan (Assigned Property List) screen loaded');
    }

    // ================================================================
    // ==== Check in to the first property ====
    // Opening a property's detail screen is what performs check-in for it.
    // If a missed-checkout dialog appears (previous day's checkout wasn't
    // completed), submit a reason first, then open the property again.
    // ================================================================
    async checkInFirstProperty() {
        await this.firstPropertyRow.waitForDisplayed({ timeout: 10000 });
        const name = await this.firstPropertyName.getText().catch(() => 'first property');
        await this.firstPropertyRow.click();
        await driver.pause(1500);

        const checkoutDialogVisible = await this.propertyCheckoutSubmitBtn.isDisplayed().catch(() => false);
        if (checkoutDialogVisible) {
            console.log('⚠️ Missed check-out dialog detected — submitting reason');
            await this.propertyCheckoutReasonField.click();
            await this.propertyCheckoutReasonField.setValue('Missed checkout - auto submitted by test');
            await driver.hideKeyboard().catch(() => {});
            await this.propertyCheckoutSubmitBtn.click();
            await driver.pause(1500);

            // Clearing the block doesn't land on the detail screen by
            // itself — open the property again now that it's unblocked.
            await this.firstPropertyRow.click();
            await driver.pause(1500);
        }

        console.log(`✅ Checked in to ${name}`);
        await driver.back();
        await driver.pause(1000);
    }
}

module.exports = new DailyWorkPlanScreen();
