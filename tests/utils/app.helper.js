const LoginScreen = require('../pageobjects/login.screen');
const HomeScreen = require('../pageobjects/home.screen');

class AppHelper {

    async loginToHome(username, password) {

        console.log('🚀 Preparing app state...');

        //
        // Wait app settle
        //
        await driver.pause(5000);

        //
        // Get current activity
        //
        const activity = await driver.getCurrentActivity();

        console.log(`ℹ️ Current Activity after wait: ${activity}`);

        // ============================================================
        // Already inside app
        // ============================================================

        if (
            activity.includes('Dashboard') ||
            activity.includes('dashboard') ||
            activity.includes('WorkProgress') ||
            activity.includes('workProgress') ||
            activity.includes('Violation') ||
            activity.includes('Pickup') ||
            activity.includes('dailyworkplan') ||
            activity.includes('AssignedProperty')
        ) {

            console.log('ℹ️ Inside app — returning to Home');

            for (let i = 0; i < 5; i++) {

                const homeVisible =
                    await $('id=com.gwl.trashscan:id/title_bar_left_menu')
                        .isDisplayed()
                        .catch(() => false);

                if (homeVisible) {

                    console.log('✅ Reached Home screen');

                    return;
                }

                await driver.back();

                await driver.pause(2000);
            }
        }

        // ============================================================
        // Tutorial Handling
        // ============================================================

        const skipBtn = await $(
            'android=new UiSelector().textContains("Skip")'
        );

        const nextBtn = await $(
            'android=new UiSelector().textContains("Next")'
        );

        if (await skipBtn.isDisplayed().catch(() => false)) {

            console.log('👉 Skip button found — clicking');

            await skipBtn.click();

            await driver.pause(3000);

        } else if (await nextBtn.isDisplayed().catch(() => false)) {

            console.log('👉 Tutorial detected — navigating');

            for (let i = 0; i < 3; i++) {

                if (await skipBtn.isDisplayed().catch(() => false)) {

                    await skipBtn.click();

                    break;
                }

                if (await nextBtn.isDisplayed().catch(() => false)) {

                    await nextBtn.click();

                    await driver.pause(1500);
                }
            }
        }

        // ============================================================
        // Location Permission
        // ============================================================

        const allowBtn = await $(
            'id=com.android.permissioncontroller:id/permission_allow_foreground_only_button'
        );

        if (await allowBtn.isDisplayed().catch(() => false)) {

            console.log('👉 Accepting location permission');

            await allowBtn.click();

            await driver.pause(2000);

        } else {

            console.log('ℹ️ Location permission popup not shown');
        }

        // ============================================================
        // Already on Login
        // ============================================================
const usernameVisible =
    await LoginScreen.username
        .isDisplayed()
        .catch(() => false);

if (!usernameVisible) {

    console.log('🔐 Waiting for username field...');

    await LoginScreen.username.waitForDisplayed({
        timeout: 20000
    });
}

        // ============================================================
        // Perform Login
        // ============================================================

        await LoginScreen.login(username, password);

        // ============================================================
        // Wait Home
        // ============================================================

        await HomeScreen.waitForHomeScreen();

        console.log('✅ User landed on Home screen');
    }
}

module.exports = new AppHelper();