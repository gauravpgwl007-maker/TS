const HomeScreen = require('./home.screen');

class MenuScreen {

    // ==== Drawer Open Button ====
    get menuButton() {
        return $('id=com.gwl.trashscan:id/title_bar_left_menu');
    }

    // ==== Drawer Menu Items ====
    get menuHome()             { return $('id=com.gwl.trashscan:id/home'); }
    get menuProfile()          { return $('id=com.gwl.trashscan:id/profile'); }
    get menuActivate()         { return $('id=com.gwl.trashscan:id/activateLayout'); }
    get menuPendingViolation() { return $('id=com.gwl.trashscan:id/rl_pending_violation'); }
    get menuLaunchTutorials()  { return $('id=com.gwl.trashscan:id/play_intro'); }
    get menuReportIssue()      { return $('id=com.gwl.trashscan:id/report_issue'); }
    get menuUpdateLocation()   { return $('id=com.gwl.trashscan:id/update_location'); }
    get menuChangeLanguage()   { return $('id=com.gwl.trashscan:id/change_language'); }
    get menuForceCheckout()    { return $('id=com.gwl.trashscan:id/rl_force_checkout'); }

    // ==== Check Home Screen ====
    async isHomeScreen() {

        return await HomeScreen.workProgressTile
            .isDisplayed()
            .catch(() => false);
    }

    // ==== Wait For Home Screen ====
    async waitForHome() {

        await HomeScreen.workProgressTile.waitForDisplayed({
            timeout: 10000
        });

        console.log('✅ Home Screen visible');
    }

    // ==== Open Drawer ====
    async openDrawer() {

        const drawerVisible = await this.menuHome
            .isDisplayed()
            .catch(() => false);

        if (drawerVisible) {
            console.log('📂 Drawer already open');
            return;
        }

        await this.menuButton.waitForDisplayed({
            timeout: 10000
        });

        await this.menuButton.click();

        console.log('📂 Drawer opened');

        await driver.pause(1000);
    }

    // ==== Return Home Safely ====
    async returnToHome() {

        console.log('🏠 Returning to Home...');

        // waitForHomeScreen loops up to 30s pressing back — handles loader screens
        await HomeScreen.waitForHomeScreen();

        console.log('✅ Back on Home');
    }

    // ==== Common Navigation ====
    async navigateTo(menuElement, menuName) {

        await HomeScreen.waitForHomeScreen();

        await this.openDrawer();

        await menuElement.waitForDisplayed({
            timeout: 5000
        });

        await menuElement.click();

        console.log(`✅ Navigated to ${menuName}`);

        await driver.pause(1500);
    }

    // ==== Menu Actions ====
    async goToHome() {
        await this.navigateTo(this.menuHome, 'Home');
    }

    async goToProfile() {
        await this.navigateTo(this.menuProfile, 'Profile');
    }

    async goToActivate() {
        await this.navigateTo(this.menuActivate, 'Activate');
    }

    async goToPendingViolation() {
        await this.navigateTo(this.menuPendingViolation, 'Pending Violation');
    }

    async goToLaunchTutorials() {
        await this.navigateTo(this.menuLaunchTutorials, 'Launch Tutorials');
    }

    async goToReportIssue() {
        await this.navigateTo(this.menuReportIssue, 'Report Issue');
    }

    async goToUpdateLocation() {
        await this.navigateTo(this.menuUpdateLocation, 'Update Location');
    }

    async goToChangeLanguage() {
        await this.navigateTo(this.menuChangeLanguage, 'Change Language');
    }

    async goToForceCheckout() {
        await this.navigateTo(this.menuForceCheckout, 'Force Checkout');
    }
}

module.exports = new MenuScreen();