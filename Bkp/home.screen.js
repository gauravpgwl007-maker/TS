class HomeScreen {

    // ==== Core Home Elements ====
    get clockInBtn()       { return $('id=com.gwl.trashscan:id/buttonClockIn'); }
    get clockOutBtn()      { return $('id=com.gwl.trashscan:id/buttonClockOut'); }
    get hamburgerMenu()    { return $('id=com.gwl.trashscan:id/title_bar_left_menu'); }

    get workProgressTile() { return $('id=com.gwl.trashscan:id/ll_work_progress'); }
    get pickupTile()       { return $('id=com.gwl.trashscan:id/ivPickUp'); }
    get activityLogsTile() { return $('id=com.gwl.trashscan:id/ivRollback'); }
    get addNotesTile()     { return $('id=com.gwl.trashscan:id/ivAddNotes'); }
    get dailyWorkPlanTile(){ return $('id=com.gwl.trashscan:id/ivAddSubs'); }
    get violationTile()    { return $('id=com.gwl.trashscan:id/ivViolation'); }

    // ==== Wait for Home Screen (navigates back as needed) ====
    async waitForHomeScreen() {
        console.log('🏠 Navigating to Home screen...');

        await driver.waitUntil(
            async () => {
                // IMPORTANT: never use `await $('id=...')` here — in WDIO v8, `await $()` makes
                // an immediate findElement API call. When the instrumentation crashes that call
                // throws a WebDriverError which escapes waitUntil rather than being caught.
                // Use `$('id=...').isDisplayed().catch(() => false)` instead — the `$()` call
                // is synchronous (lazy element reference), and only `.isDisplayed()` is async.
                if (await this.hamburgerMenu.isDisplayed().catch(() => false)) return true;
                if (await this.clockInBtn.isDisplayed().catch(() => false)) return true;
                if (await this.workProgressTile.isDisplayed().catch(() => false)) return true;

                // If the in-app back arrow is visible, click it — hardware back on forms
                // with unsaved state triggers a "Discard?" dialog loop instead of navigating back
                if (await $('id=com.gwl.trashscan:id/backArrow').isDisplayed().catch(() => false)) {
                    await $('id=com.gwl.trashscan:id/backArrow').click().catch(() => {});
                    await driver.pause(600);
                    // Dismiss any "Discard changes?" dialog that appears after clicking back arrow
                    for (const label of ['Discard', 'Yes', 'Leave', 'OK']) {
                        if (await $(`android=new UiSelector().text("${label}")`).isDisplayed().catch(() => false)) {
                            await $(`android=new UiSelector().text("${label}")`).click().catch(() => {});
                            break;
                        }
                    }
                    await driver.pause(400);
                    return false;
                }

                // No in-app back arrow — use hardware back
                await driver.back().catch(() => {});
                await driver.pause(800);
                return false;
            },
            { timeout: 30000, timeoutMsg: '❌ Could not reach Home screen after repeated back navigation' }
        );

        console.log('✅ Home screen loaded');
    }

    // ==== Wait for tiles after clock-in ====
    async waitForHomeTiles() {
        console.log('🏠 Waiting for Home screen tiles...');

        await driver.waitUntil(async () => {
            return (
                await this.workProgressTile.isDisplayed().catch(() => false) &&
                await this.pickupTile.isDisplayed().catch(() => false)
            );
        }, {
            timeout: 30000,
            timeoutMsg: '❌ Home screen tiles did not load properly'
        });

        console.log('✅ Home screen tiles loaded');
    }

    // ==== Navigate back safely ====
    async backToHome() {
        for (let i = 0; i < 10; i++) {
            const onHome = await this.hamburgerMenu.isDisplayed().catch(() => false)
                        || await this.clockInBtn.isDisplayed().catch(() => false)
                        || await this.workProgressTile.isDisplayed().catch(() => false);
            if (onHome) {
                console.log('🏠 Reached Home');
                return;
            }
            // Prefer in-app back arrow over hardware back to avoid discard dialog loops.
            // Do NOT use `await $()` — use `$().isDisplayed()` to keep the element lookup lazy.
            if (await $('id=com.gwl.trashscan:id/backArrow').isDisplayed().catch(() => false)) {
                await $('id=com.gwl.trashscan:id/backArrow').click().catch(() => {});
                await driver.pause(600);
                for (const label of ['Discard', 'Yes', 'Leave', 'OK']) {
                    if (await $(`android=new UiSelector().text("${label}")`).isDisplayed().catch(() => false)) {
                        await $(`android=new UiSelector().text("${label}")`).click().catch(() => {});
                        break;
                    }
                }
            } else {
                await driver.back().catch(() => {});
            }
            await driver.pause(800);
        }

        throw new Error('❌ Failed to navigate back to Home');
    }

    // ==== Handle Camera Permission ====
    async allowCameraPermissionIfPresent() {
        try {
            const allowBtn = await $('android=new UiSelector().resourceId("com.android.permissioncontroller:id/permission_allow_button")');
            await allowBtn.waitForDisplayed({ timeout: 3000 });
            await allowBtn.click();
            console.log('📷 Camera permission allowed');
        } catch {
            console.log('ℹ️ Camera permission popup not shown');
        }
    }
}

module.exports = new HomeScreen();
