class MenuScreen {

    // ==== Drawer Open Button ====
    get menuButton() { return $('id=com.gwl.trashscan:id/title_bar_left_menu'); }

    // ==== Drawer Menu Items (source-verified from view_menu_left.xml — RelativeLayout IDs) ====
    get menuHome()            { return $('id=com.gwl.trashscan:id/home'); }
    get menuProfile()         { return $('id=com.gwl.trashscan:id/profile'); }
    get menuActivate()        { return $('id=com.gwl.trashscan:id/activateLayout'); }
    get menuPendingViolation(){ return $('id=com.gwl.trashscan:id/rl_pending_violation'); }
    get menuLaunchTutorials() { return $('id=com.gwl.trashscan:id/play_intro'); }
    get menuReportIssue()     { return $('id=com.gwl.trashscan:id/report_issue'); }
    get menuUpdateLocation()  { return $('id=com.gwl.trashscan:id/update_location'); }
    get menuChangeLanguage()  { return $('id=com.gwl.trashscan:id/change_language'); }
    get menuForceCheckout()   { return $('id=com.gwl.trashscan:id/rl_force_checkout'); }
    // Note: Android source has typo "boardcast" in the ID — must match exactly
    get menuMessageBroadcast(){ return $('id=com.gwl.trashscan:id/rl_message_boardcast'); }
    get menuCustomerSupport() { return $('id=com.gwl.trashscan:id/rl_customerSupport'); }
    get menuPorterMap()       { return $('id=com.gwl.trashscan:id/porterMap'); }
    get menuLogout()          { return $('id=com.gwl.trashscan:id/logout'); }

    // ==== Open Drawer ====
    async openDrawer() {
        try {
            await this.menuButton.waitForDisplayed({ timeout: 5000 });
            await this.menuButton.click();
            console.log('📂 Drawer menu opened');
            await driver.pause(800);
        } catch (err) {
            console.log('⚠️ Could not open drawer via button, trying swipe...');
            const { width, height } = await driver.getWindowSize();
            await driver.action('pointer')
                .move({ x: 5, y: height / 2 })
                .down()
                .move({ x: Math.floor(width * 0.4), y: height / 2 })
                .up()
                .perform();
            await driver.pause(800);
        }
    }

    // ==== Return to Home via Menu ====
    async returnViaMenu() {
        console.log('🔁 Returning to Home via drawer menu...');
        await driver.pause(500);
        await this.openDrawer();
        await this.menuHome.waitForDisplayed({ timeout: 5000 });
        await this.menuHome.click();
        console.log('🏠 Returned to Home via drawer menu');
        await driver.pause(1000);
    }

    // ==== Menu Navigation Actions ====
    async goToHome() {
        await this.openDrawer();
        await this.menuHome.waitForDisplayed({ timeout: 5000 });
        await this.menuHome.click();
        console.log('🏠 Navigated to Home');
    }

    async goToProfile() {
        await this.openDrawer();
        await this.menuProfile.waitForDisplayed({ timeout: 5000 });
        await this.menuProfile.click();
        console.log('👤 Navigated to Profile');
    }

    async goToActivate() {
        await this.openDrawer();
        await this.menuActivate.waitForDisplayed({ timeout: 5000 });
        await this.menuActivate.click();
        console.log('✅ Navigated to Activate');
    }

    async goToPendingViolation() {
        await this.openDrawer();
        await this.menuPendingViolation.waitForDisplayed({ timeout: 5000 });
        await this.menuPendingViolation.click();
        console.log('⚠️ Navigated to Pending Violation');
    }

    async goToLaunchTutorials() {
        await this.openDrawer();
        await this.menuLaunchTutorials.waitForDisplayed({ timeout: 5000 });
        await this.menuLaunchTutorials.click();
        console.log('📚 Navigated to Launch Tutorials');
    }

    async goToReportIssue() {
        await this.openDrawer();
        await this.menuReportIssue.waitForDisplayed({ timeout: 5000 });
        await this.menuReportIssue.click();
        console.log('🚨 Navigated to Report Issue');
    }

    async goToUpdateLocation() {
        await this.openDrawer();
        await this.menuUpdateLocation.waitForDisplayed({ timeout: 5000 });
        await this.menuUpdateLocation.click();
        console.log('📍 Navigated to Update Location');
    }

    async goToChangeLanguage() {
        await this.openDrawer();
        await this.menuChangeLanguage.waitForDisplayed({ timeout: 5000 });
        await this.menuChangeLanguage.click();
        console.log('🌐 Navigated to Change Language');
    }

    async goToForceCheckout() {
        await this.openDrawer();
        await this.menuForceCheckout.waitForDisplayed({ timeout: 5000 });
        await this.menuForceCheckout.click();
        console.log('🔄 Navigated to Force Checkout');
    }

    async goToMessageBroadcast() {
        await this.openDrawer();
        await this.menuMessageBroadcast.waitForDisplayed({ timeout: 5000 });
        await this.menuMessageBroadcast.click();
        console.log('📢 Navigated to Message Broadcast');
    }
}

module.exports = new MenuScreen();
