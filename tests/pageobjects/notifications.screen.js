const HomeScreen = require('./home.screen');

class NotificationsScreen {

    // ==== Notification Bell on Home Screen (source-verified: title_bar_right_menu) ====
    get notificationIcon() { return $('id=com.gwl.trashscan:id/title_bar_right_menu'); }

    // ==== Notification List Screen (source-verified from activity_notification_history.xml) ====
    get notificationList()     { return $('id=com.gwl.trashscan:id/recyclerview_notification_history'); }
    get emptyStateMsg()        { return $('id=com.gwl.trashscan:id/textViewNoRecords'); }
    get notificationListTitle(){ return $('android=new UiSelector().textContains("Notification")'); }
    get backBtn()              { return $('~Navigate up'); }

    // ==== Notification Row Items (from activity_notification_history_row.xml) ====
    // Rows are CardViews inside the recyclerview; first item via instance(0)
    get firstNotificationItem(){ return $('android=new UiSelector().resourceId("com.gwl.trashscan:id/cardView").instance(0)'); }
    get firstNotifTitle()      { return $('android=new UiSelector().resourceId("com.gwl.trashscan:id/title").instance(0)'); }
    get firstNotifTimestamp()  { return $('android=new UiSelector().resourceId("com.gwl.trashscan:id/date").instance(0)'); }
    // Unread dot — if the app uses it; fall back to false gracefully
    get firstNotifUnreadDot()  { return $('android=new UiSelector().resourceId("com.gwl.trashscan:id/unreadDot").instance(0)'); }

    // ==== Open Notification Screen ====
    async openNotifications() {
        try {
            await this.notificationIcon.waitForDisplayed({ timeout: 5000 });
            await this.notificationIcon.click();
            console.log('🔔 Notification screen opened');
            await driver.pause(1500);
        } catch {
            console.log('⚠️ Notification icon not found');
        }
    }

    // ==== Wait for Notification List to Load ====
    async waitForNotificationList() {
        await driver.waitUntil(
            async () => {
                if (await $('id=com.gwl.trashscan:id/recyclerview_notification_history').isDisplayed().catch(() => false)) return true;
                if (await $('id=com.gwl.trashscan:id/textViewNoRecords').isDisplayed().catch(() => false)) return true;
                if (await $('android=new UiSelector().textContains("Notification")').isDisplayed().catch(() => false)) return true;
                return false;
            },
            { timeout: 15000, timeoutMsg: '❌ Notification list screen did not load.' }
        );
        console.log('✅ Notification list loaded');
    }

    // ==== Tap First Notification ====
    async tapFirstNotification() {
        try {
            await this.firstNotificationItem.waitForDisplayed({ timeout: 5000 });
            await this.firstNotificationItem.click();
            console.log('🔔 First notification tapped');
            await driver.pause(1000);
        } catch {
            console.log('⚠️ No notifications to tap');
        }
    }

    // ==== Check if Empty State Shown ====
    async isEmptyStateVisible() {
        try {
            return await this.emptyStateMsg.isDisplayed();
        } catch {
            return false;
        }
    }

    // ==== Check if List Has Items ====
    async hasNotifications() {
        try {
            return await this.firstNotificationItem.isDisplayed();
        } catch {
            return false;
        }
    }

    // ==== Get Notification Badge Text (from home screen) ====
    async getNotificationBadgeText() {
        try {
            // The badge is a child of the notification button — try text-based approach
            const badge = await $('android=new UiSelector().resourceId("com.gwl.trashscan:id/notification_badge")');
            if (await badge.isDisplayed().catch(() => false)) {
                return await badge.getText();
            }
            return null;
        } catch {
            return null;
        }
    }

    // ==== Get First Notification Timestamp ====
    async getFirstNotifTimestamp() {
        try {
            await this.firstNotifTimestamp.waitForDisplayed({ timeout: 5000 });
            return await this.firstNotifTimestamp.getText();
        } catch {
            return null;
        }
    }

    // ==== Scroll Down ====
    async scrollDown() {
        const { width, height } = await driver.getWindowSize();
        await driver.action('pointer')
            .move({ x: width / 2, y: Math.floor(height * 0.7) })
            .down()
            .move({ x: width / 2, y: Math.floor(height * 0.3) })
            .up()
            .perform();
        await driver.pause(500);
    }

    // ==== Back to Home ====
    async backToHome() {
        try {
            await this.backBtn.waitForDisplayed({ timeout: 8000 });
            await this.backBtn.click();
        } catch {
            await driver.back();
        }
        await HomeScreen.waitForHomeScreen();
    }

    // ==== Back from Detail to List ====
    async backFromDetail() {
        try {
            await this.backBtn.waitForDisplayed({ timeout: 5000 });
            await this.backBtn.click();
        } catch {
            await driver.back();
        }
        await driver.pause(800);
    }
}

module.exports = new NotificationsScreen();
