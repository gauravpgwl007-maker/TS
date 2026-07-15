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

    // ==== Shared drawer-item navigation ====
    // If the target item never appears, the drawer must not be left open —
    // an open drawer overlaps the home screen and silently swallows whatever
    // the next step (or the next test) clicks, turning one failure into a
    // chain of unrelated ones. So close it before rethrowing.
    async _navigateDrawerItem(item, label, emoji = '➡️') {
        await this.openDrawer();
        try {
            await item.waitForDisplayed({ timeout: 8000 });
            await item.click();
            console.log(`${emoji} Navigated to ${label}`);
        } catch (err) {
            console.log(`⚠️ Could not navigate to ${label} — closing drawer`);
            await driver.back().catch(() => {});
            await driver.pause(600);
            throw err;
        }
    }

    // ==== Menu Navigation Actions ====
    async goToHome() {
        await this._navigateDrawerItem(this.menuHome, 'Home', '🏠');
    }

    async goToProfile() {
        await this._navigateDrawerItem(this.menuProfile, 'Profile', '👤');
    }

    async goToActivate() {
        await this._navigateDrawerItem(this.menuActivate, 'Activate', '✅');
    }

    async goToPendingViolation() {
        await this._navigateDrawerItem(this.menuPendingViolation, 'Pending Violation', '⚠️');
    }

    async goToLaunchTutorials() {
        await this._navigateDrawerItem(this.menuLaunchTutorials, 'Launch Tutorials', '📚');
    }

    async goToReportIssue() {
        await this._navigateDrawerItem(this.menuReportIssue, 'Report Issue', '🚨');
    }

    async goToUpdateLocation() {
        await this._navigateDrawerItem(this.menuUpdateLocation, 'Update Location', '📍');
    }

    async goToChangeLanguage() {
        await this._navigateDrawerItem(this.menuChangeLanguage, 'Change Language', '🌐');
    }

    async goToForceCheckout() {
        await this._navigateDrawerItem(this.menuForceCheckout, 'Force Checkout', '🔄');
    }

    async goToMessageBroadcast() {
        await this._navigateDrawerItem(this.menuMessageBroadcast, 'Message Broadcast', '📢');
    }
}

module.exports = new MenuScreen();
