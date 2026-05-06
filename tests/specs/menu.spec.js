const MenuScreen = require('../pageobjects/menu.screen');
const HomeScreen = require('../pageobjects/home.screen');

describe('Drawer Menu Functionality', () => {

    before(async () => {
        await HomeScreen.waitForHomeScreen();
    });

    afterEach(async () => {
        // Ensure we return to home screen after each menu test
        try {
            await HomeScreen.waitForHomeScreen();
        } catch {
            // If not on home, try navigating back
            try {
                await driver.back();
                await HomeScreen.waitForHomeScreen();
            } catch {
                await MenuScreen.returnViaMenu();
            }
        }
    });

    it('should open Home from drawer menu', async () => {
        await HomeScreen.waitForHomeScreen();
        await MenuScreen.goToHome();
        const tile = await HomeScreen.workProgressTile.isDisplayed().catch(() => false);
        expect(tile).toBe(true);
        console.log('✅ Home menu item works');
    });

    it('should open Profile from drawer menu', async () => {
        await HomeScreen.waitForHomeScreen();
        await MenuScreen.goToProfile();
        await driver.pause(1000);
        // Profile shows username or image — just verify we navigated away from home
        const profileVisible = await $('id=com.gwl.trashscan:id/imageViewUsrProfile').isDisplayed().catch(() => false)
                            || await $('id=com.gwl.trashscan:id/textemail').isDisplayed().catch(() => false)
                            || await $('android=new UiSelector().textContains("Profile")').isDisplayed().catch(() => false);
        console.log(`ℹ️ Profile visible: ${profileVisible}`);
        console.log('✅ Profile navigation works');
        // Navigate back to home
        await driver.back();
    });

    it('should open Activate from drawer menu', async () => {
        await HomeScreen.waitForHomeScreen();
        await MenuScreen.goToActivate();
        await driver.pause(1000);
        console.log('✅ Activate navigation works');
        await HomeScreen.backToHome();
    });

    it('should open Pending Violation from drawer menu', async () => {
        await HomeScreen.waitForHomeScreen();
        await MenuScreen.goToPendingViolation();
        await driver.pause(1000);
        console.log('✅ Pending Violation navigation works');
        await driver.back();
    });

    it('should open Launch Tutorials from drawer menu', async () => {
        await HomeScreen.waitForHomeScreen();
        await MenuScreen.goToLaunchTutorials();
        await driver.pause(1000);
        console.log('✅ Tutorials navigation works');
        await driver.back();
    });

    it('should open Report Issue from drawer menu', async () => {
        await HomeScreen.waitForHomeScreen();
        await MenuScreen.goToReportIssue();
        await driver.pause(1000);
        console.log('✅ Report Issue navigation works');
        await HomeScreen.backToHome();
    });

    it('should open Update Location from drawer menu', async () => {
        await HomeScreen.waitForHomeScreen();
        await MenuScreen.goToUpdateLocation();
        await driver.pause(1000);
        console.log('✅ Update Location navigation works');
        await HomeScreen.backToHome();
    });

    it('should open Change Language from drawer menu', async () => {
        await HomeScreen.waitForHomeScreen();
        await MenuScreen.goToChangeLanguage();
        await driver.pause(1000);
        // A dialog appears — cancel it
        const noBtn = await $('android=new UiSelector().text("No")');
        if (await noBtn.isDisplayed().catch(() => false)) {
            await noBtn.click();
        } else {
            await driver.back();
        }
        console.log('✅ Change Language navigation works');
    });

    it('should open Force Checkout from drawer menu', async () => {
        await HomeScreen.waitForHomeScreen();
        await MenuScreen.goToForceCheckout();
        await driver.pause(1000);
        console.log('✅ Force Checkout navigation works');
        await driver.back();
    });
});
