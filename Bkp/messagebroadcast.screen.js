const HomeScreen = require('./home.screen');

class MessageBroadcastScreen {

    // ==== Drawer Entry (source-verified: rl_message_boardcast — note typo in source) ====
    get menuButton()           { return $('id=com.gwl.trashscan:id/title_bar_left_menu'); }
    // Note: the Android source has a typo "boardcast" — this must match exactly
    get menuMessageBroadcast() { return $('id=com.gwl.trashscan:id/rl_message_boardcast'); }

    // ==== Message Broadcast Screen (source-verified from fragment_message_board_cast.xml) ====
    get broadcastTitle()      { return $('android=new UiSelector().textContains("Message")'); }
    // Property dropdown (disabled in XML — not tappable by default in this fragment)
    get propertyDropdown()    { return $('id=com.gwl.trashscan:id/tv_select_property'); }
    // Members/User list dropdown trigger
    get userListDropdown()    { return $('id=com.gwl.trashscan:id/tv_select_members'); }
    // Title input (maxLength=50 in source)
    get messageTitleField()   { return $('id=com.gwl.trashscan:id/et_title_description'); }
    // Description/Message input (maxLength=250 in source)
    get messageDescField()    { return $('id=com.gwl.trashscan:id/et_message_description'); }
    // Send button (TextView styled as button, text="SEND")
    get sendBtn()             { return $('id=com.gwl.trashscan:id/text_done'); }

    // ==== Custom List Dialog (source-verified from custom_list_dialog.xml) ====
    // Shown when tv_select_members is tapped
    get userSearchInput()    { return $('id=com.gwl.trashscan:id/searchEditText'); }
    get userListRecycler()   { return $('id=com.gwl.trashscan:id/recyclerViewLocation'); }
    get userDoneBtn()        { return $('id=com.gwl.trashscan:id/doneBtn'); }
    get userCancelBtn()      { return $('id=com.gwl.trashscan:id/cancelBtn'); }
    get userNoRecord()       { return $('id=com.gwl.trashscan:id/tv_noRecord'); }

    // ==== User List Item (source-verified from item_custom_dialog.xml) ====
    // Each row has playerCB (AppCompatCheckBox) and itemName (TextView)
    get firstUserCheckbox()  { return $('android=new UiSelector().resourceId("com.gwl.trashscan:id/playerCB").instance(0)'); }
    get secondUserCheckbox() { return $('android=new UiSelector().resourceId("com.gwl.trashscan:id/playerCB").instance(1)'); }
    get firstUserName()      { return $('android=new UiSelector().resourceId("com.gwl.trashscan:id/itemName").instance(0)'); }

    // ==== Confirmation / Feedback ====
    get confirmYesBtn()  { return $('android=new UiSelector().text("Yes")'); }
    get confirmNoBtn()   { return $('android=new UiSelector().text("No")'); }

    // ================================================================
    // ==== Open Message Broadcast from Drawer ====
    // ================================================================
    async openFromDrawer() {
        try {
            await this.menuButton.waitForDisplayed({ timeout: 5000 });
            await this.menuButton.click();
            await driver.pause(800);
            await this.menuMessageBroadcast.waitForDisplayed({ timeout: 5000 });
            await this.menuMessageBroadcast.click();
            console.log('📢 Message Broadcast opened');
            await driver.pause(1500);
        } catch {
            console.log('⚠️ Message Broadcast not in menu — may not be admin user');
        }
    }

    // ================================================================
    // ==== Wait for Broadcast Screen ====
    // ================================================================
    async waitForBroadcastScreen() {
        await driver.waitUntil(
            async () => {
                if (await $('id=com.gwl.trashscan:id/et_title_description').isDisplayed().catch(() => false)) return true;
                if (await $('id=com.gwl.trashscan:id/et_message_description').isDisplayed().catch(() => false)) return true;
                if (await $('id=com.gwl.trashscan:id/tv_select_members').isDisplayed().catch(() => false)) return true;
                if (await $('id=com.gwl.trashscan:id/text_done').isDisplayed().catch(() => false)) return true;
                return false;
            },
            { timeout: 15000, timeoutMsg: '❌ Message Broadcast screen did not load.' }
        );
        console.log('✅ Message Broadcast screen loaded');
    }

    // ================================================================
    // ==== User Selection ====
    // ================================================================
    async openUserListDropdown() {
        try {
            await this.userListDropdown.waitForDisplayed({ timeout: 5000 });
            await this.userListDropdown.click();
            console.log('👥 User list dropdown opened');
            await driver.pause(1000);
        } catch {
            console.log('⚠️ User list dropdown not found');
        }
    }

    async searchUser(name) {
        try {
            await this.userSearchInput.waitForDisplayed({ timeout: 5000 });
            await this.userSearchInput.setValue(name);
            console.log(`🔍 Searched user: "${name}"`);
            await driver.pause(1000);
        } catch {
            console.log('⚠️ User search input not found');
        }
    }

    async selectFirstUser() {
        try {
            await this.firstUserCheckbox.waitForDisplayed({ timeout: 5000 });
            await this.firstUserCheckbox.click();
            console.log('✅ First user selected');
        } catch {
            console.log('⚠️ First user checkbox not found');
        }
    }

    async selectMultipleUsers(count = 2) {
        for (let i = 0; i < count; i++) {
            try {
                const checkbox = await $(`android=new UiSelector().resourceId("com.gwl.trashscan:id/playerCB").instance(${i})`);
                if (await checkbox.isDisplayed().catch(() => false)) {
                    await checkbox.click();
                    console.log(`✅ User ${i + 1} selected`);
                }
            } catch {
                console.log(`⚠️ User ${i + 1} checkbox not found`);
            }
        }
    }

    async deselectFirstUser() {
        try {
            await this.firstUserCheckbox.waitForDisplayed({ timeout: 5000 });
            await this.firstUserCheckbox.click();
            console.log('✅ First user deselected');
        } catch {
            console.log('⚠️ Could not deselect user');
        }
    }

    async tapUserDone() {
        try {
            await this.userDoneBtn.waitForDisplayed({ timeout: 5000 });
            await this.userDoneBtn.click();
            console.log('✅ User selection Done tapped');
            await driver.pause(800);
        } catch {
            console.log('⚠️ Done button not found');
        }
    }

    // ================================================================
    // ==== Title and Description ====
    // ================================================================
    async enterTitle(title) {
        try {
            await this.messageTitleField.waitForDisplayed({ timeout: 5000 });
            await this.messageTitleField.clearValue();
            await this.messageTitleField.setValue(title);
            console.log(`✅ Title entered: "${title}"`);
        } catch {
            console.log('⚠️ Title field not found');
        }
    }

    async enterDescription(desc) {
        try {
            await this.messageDescField.waitForDisplayed({ timeout: 5000 });
            await this.messageDescField.clearValue();
            await this.messageDescField.setValue(desc);
            console.log('✅ Description entered');
        } catch {
            console.log('⚠️ Description field not found');
        }
    }

    // ================================================================
    // ==== Send ====
    // ================================================================
    async tapSend() {
        try {
            await this.sendBtn.waitForDisplayed({ timeout: 5000 });
            await this.sendBtn.click();
            console.log('📤 Send tapped');
            await driver.pause(2000);
        } catch {
            console.log('⚠️ Send button not found');
        }
    }

    async confirmSend() {
        try {
            await this.confirmYesBtn.waitForDisplayed({ timeout: 5000 });
            await this.confirmYesBtn.click();
            console.log('✅ Send confirmed');
            await driver.pause(2000);
        } catch {}
    }

    // ================================================================
    // ==== Validation / Success ====
    // ================================================================
    async isValidationVisible() {
        try {
            // Look for any toast or inline validation message
            const toast = await $('android=new UiSelector().textContains("required")');
            if (await toast.isDisplayed().catch(() => false)) return true;
            const toast2 = await $('android=new UiSelector().textContains("select")');
            if (await toast2.isDisplayed().catch(() => false)) return true;
            return false;
        } catch {
            return false;
        }
    }

    async isSuccessMessageVisible() {
        try {
            const toast = await $('android=new UiSelector().textContains("sent")');
            if (await toast.isDisplayed().catch(() => false)) return true;
            const toast2 = await $('android=new UiSelector().textContains("success")');
            if (await toast2.isDisplayed().catch(() => false)) return true;
            return false;
        } catch {
            return false;
        }
    }

    // ================================================================
    // ==== Back to Home ====
    // ================================================================
    async backToHome() {
        try {
            const back = await $('~Navigate up');
            await back.waitForDisplayed({ timeout: 5000 });
            await back.click();
        } catch {
            await driver.back();
        }
        await HomeScreen.waitForHomeScreen();
    }
}

module.exports = new MessageBroadcastScreen();
