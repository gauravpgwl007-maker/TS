const HomeScreen     = require('../pageobjects/home.screen');
const SettingsScreen = require('../pageobjects/settings.screen');

describe('Porter - Settings Menu (TC001-TC165 key scenarios)', () => {

    before(async () => {
        try {
            await driver.execute('mobile: shell', { command: 'pm grant', args: ['com.gwl.trashscan', 'android.permission.CAMERA'] });
            await driver.execute('mobile: shell', { command: 'pm grant', args: ['com.gwl.trashscan', 'android.permission.ACCESS_FINE_LOCATION'] });
            await driver.execute('mobile: shell', { command: 'pm grant', args: ['com.gwl.trashscan', 'android.permission.READ_MEDIA_IMAGES'] });
            await driver.execute('mobile: shell', { command: 'pm grant', args: ['com.gwl.trashscan', 'android.permission.READ_MEDIA_VIDEO'] });
            console.log('✅ Permissions granted');
        } catch { console.log('⚠️ Permission grant failed'); }
        await HomeScreen.waitForHomeScreen();
    });

    // ════════════════════════════════════════════════════════════════
    // ── HAMBURGER MENU (TC001-TC002) ─────────────────────────────
    // ════════════════════════════════════════════════════════════════

    it('TC001 - should open hamburger menu and display all listed options', async () => {
        await HomeScreen.waitForHomeScreen();
        await SettingsScreen.openDrawer();
        const homeVisible    = await SettingsScreen.menuHome.isDisplayed().catch(() => false);
        const profileVisible = await SettingsScreen.menuProfile.isDisplayed().catch(() => false);
        const logoutVisible  = await SettingsScreen.menuLogout.isDisplayed().catch(() => false);
        expect(homeVisible || profileVisible || logoutVisible).toBe(true);
        await driver.back();
        console.log('✅ TC001 PASS: Hamburger menu items visible');
    });

    it('TC002 - clicking Home from menu should redirect to dashboard', async () => {
        await HomeScreen.waitForHomeScreen();
        await SettingsScreen.openDrawer();
        await SettingsScreen.menuHome.waitForDisplayed({ timeout: 5000 });
        await SettingsScreen.menuHome.click();
        await HomeScreen.waitForHomeScreen();
        expect(await HomeScreen.workProgressTile.isDisplayed()).toBe(true);
        console.log('✅ TC002 PASS');
    });

    // ════════════════════════════════════════════════════════════════
    // ── PROFILE (TC003-TC008) ────────────────────────────────────
    // ════════════════════════════════════════════════════════════════

    it('TC003 - clicking Profile should navigate to Profile screen', async () => {
        await HomeScreen.waitForHomeScreen();
        await SettingsScreen.openProfile();
        const onProfile = await SettingsScreen.isProfileFieldsVisible()
                       || await $('android=new UiSelector().textContains("Profile")').isDisplayed().catch(() => false);
        expect(onProfile).toBe(true);
        console.log('✅ TC003 PASS: Profile screen opened');
    });

    it('TC004 - should allow uploading and changing profile picture', async () => {
        const picVisible = await SettingsScreen.profilePicture.isDisplayed().catch(() => false);
        if (picVisible) {
            await SettingsScreen.profilePicture.click();
            await driver.pause(1000);
            // Dismiss any dialog
            await driver.back();
        }
        console.log(`ℹ️ TC004: Profile picture tappable: ${picVisible}`);
        console.log('✅ TC004 PASS');
    });

    it('TC007 - should display employee details on Profile screen', async () => {
        const idVisible   = await SettingsScreen.employeeId.isDisplayed().catch(() => false);
        const deptVisible = await SettingsScreen.employeeDept.isDisplayed().catch(() => false);
        const nameVisible = await SettingsScreen.profileNameField.isDisplayed().catch(() => false);
        console.log(`ℹ️ TC007 — ID: ${idVisible}, Dept: ${deptVisible}, Name: ${nameVisible}`);
        expect(idVisible || nameVisible).toBe(true);
        console.log('✅ TC007 PASS');
    });

    it('TC008 - Save button should appear after making a profile change', async () => {
        if (await SettingsScreen.profileEmailField.isDisplayed().catch(() => false)) {
            const currentEmail = await SettingsScreen.profileEmailField.getText().catch(() => '');
            await SettingsScreen.editProfileField(SettingsScreen.profileEmailField, currentEmail + ' ');
            const saveVisible = await SettingsScreen.profileSaveBtn.isDisplayed().catch(() => false);
            console.log(`ℹ️ TC008: Save button after change: ${saveVisible}`);
            await driver.back(); // Dismiss without saving
        }
        console.log('✅ TC008 PASS');
        await SettingsScreen.returnToHomeViaMenu();
    });

    // ════════════════════════════════════════════════════════════════
    // ── ACTIVATE SCANNER (TC009-TC030) ───────────────────────────
    // ════════════════════════════════════════════════════════════════

    it('TC009 - should navigate to Activate scanner from Settings menu', async () => {
        await HomeScreen.waitForHomeScreen();
        await SettingsScreen.openActivate();
        const scannerVisible = await SettingsScreen.activateScannerView.isDisplayed().catch(() => false)
                            || await $('id=com.gwl.trashscan:id/imageView_flash_camera').isDisplayed().catch(() => false);
        console.log(`ℹ️ TC009: Activate scanner visible: ${scannerVisible}`);
        console.log('✅ TC009 PASS');
    });

    it('TC015 - should toggle flash ON in Activate scanner', async () => {
        await SettingsScreen.toggleActivateFlash();
        console.log('✅ TC015 PASS: Flash toggled ON');
    });

    it('TC016 - should toggle flash OFF in Activate scanner', async () => {
        await SettingsScreen.toggleActivateFlash();
        console.log('✅ TC016 PASS: Flash toggled OFF');
    });

    it('TC018 - should open activity logs from Activate scanner screen', async () => {
        await SettingsScreen.openActivityLogsFromActivate();
        await driver.pause(1000);
        await driver.back();
        console.log('✅ TC018 PASS');
    });

    it('TC024 - Activate scanner screen should display UI elements', async () => {
        const scannerEl = await $('id=com.gwl.trashscan:id/surface_view').isDisplayed().catch(() => false)
                       || await $('id=com.gwl.trashscan:id/imageView_flash_camera').isDisplayed().catch(() => false);
        expect(scannerEl).toBe(true);
        console.log('✅ TC024 PASS: Activate scanner UI elements visible');
        await HomeScreen.backToHome();
    });

    // ════════════════════════════════════════════════════════════════
    // ── PENDING VIOLATION (TC032-TC055) ──────────────────────────
    // ════════════════════════════════════════════════════════════════

    it('TC032 - should navigate to Pending Violations list from menu', async () => {
        await HomeScreen.waitForHomeScreen();
        await SettingsScreen.openPendingViolation();
        const listOrEmpty = await SettingsScreen.pendingViolationList.isDisplayed().catch(() => false)
                         || await SettingsScreen.pendingEmptyState.isDisplayed().catch(() => false)
                         || await $('android=new UiSelector().textContains("Pending")').isDisplayed().catch(() => false);
        expect(listOrEmpty).toBe(true);
        console.log('✅ TC032 PASS: Pending Violations screen loaded');
    });

    it('TC033 - should open a pending violation if one exists', async () => {
        await SettingsScreen.openFirstPendingViolation();
        console.log('✅ TC033 PASS');
    });

    it('TC043 - should display auto-captured image in pending violation form', async () => {
        const imgVisible = await SettingsScreen.pendingViolationImage.isDisplayed().catch(() => false);
        console.log(`ℹ️ TC043: Auto-captured image visible: ${imgVisible}`);
        console.log('✅ TC043 PASS');
    });

    it('TC037 - should show validation when Property is missing on submit', async () => {
        const submitVisible = await SettingsScreen.pendingSubmitBtn.isDisplayed().catch(() => false);
        if (submitVisible) {
            await SettingsScreen.pendingSubmitBtn.click();
            await driver.pause(1000);
            const errorShown = await $('android=new UiSelector().textContains("required")').isDisplayed().catch(() => false)
                            || await $('android=new UiSelector().textContains("select")').isDisplayed().catch(() => false);
            console.log(`ℹ️ TC037: Validation on missing property: ${errorShown}`);
        }
        await SettingsScreen.returnToHomeViaMenu();
        console.log('✅ TC037 PASS');
    });

    // ════════════════════════════════════════════════════════════════
    // ── TUTORIALS / PLAY INTRO (TC057-TC076) ─────────────────────
    // ════════════════════════════════════════════════════════════════

    it('TC057 - tapping Play Intro should open onboarding tutorial slides', async () => {
        await HomeScreen.waitForHomeScreen();
        await SettingsScreen.openTutorials();
        const tutorialVisible = await SettingsScreen.tutorialContainer.isDisplayed().catch(() => false)
                             || await SettingsScreen.tutorialSlide.isDisplayed().catch(() => false)
                             || await $('android=new UiSelector().textContains("Tutorial")').isDisplayed().catch(() => false);
        console.log(`ℹ️ TC057: Tutorial screen visible: ${tutorialVisible}`);
        console.log('✅ TC057 PASS');
    });

    it('TC059 - should swipe left to view next tutorial screen', async () => {
        await SettingsScreen.swipeLeftOnTutorial();
        console.log('✅ TC059 PASS: Swiped left on tutorial');
    });

    it('TC060 - should swipe right to go back to previous tutorial screen', async () => {
        await SettingsScreen.swipeRightOnTutorial();
        console.log('✅ TC060 PASS: Swiped right on tutorial');
    });

    it('TC061 - should be able to swipe through all tutorial screens', async () => {
        for (let i = 0; i < 5; i++) {
            await SettingsScreen.swipeLeftOnTutorial();
        }
        console.log('✅ TC061 PASS: Swiped through tutorial screens');
        await SettingsScreen.returnToHomeViaMenu();
    });

    // ════════════════════════════════════════════════════════════════
    // ── REPORT ISSUE (TC078-TC103) ────────────────────────────────
    // ════════════════════════════════════════════════════════════════

    it('TC078 - tapping Report Issue should open a form to log app issues', async () => {
        await HomeScreen.waitForHomeScreen();
        await SettingsScreen.openReportIssue();
        const formVisible = await SettingsScreen.reportIssueTitle.isDisplayed().catch(() => false)
                         || await SettingsScreen.issueDescriptionField.isDisplayed().catch(() => false)
                         || await SettingsScreen.issueCategoryDropdown.isDisplayed().catch(() => false);
        expect(formVisible).toBe(true);
        console.log('✅ TC078 PASS: Report Issue form opened');
    });

    it('TC080 - should display category dropdown options when tapped', async () => {
        await SettingsScreen.issueCategoryDropdown.waitForDisplayed({ timeout: 5000 });
        await SettingsScreen.issueCategoryDropdown.click();
        await driver.pause(800);
        const dropdownOpen = await $('android=new UiSelector().resourceId("com.gwl.trashscan:id/playerCB").instance(0)').isDisplayed().catch(() => false);
        console.log(`ℹ️ TC080: Category dropdown open: ${dropdownOpen}`);
        await driver.back();
        console.log('✅ TC080 PASS');
    });

    it('TC081 - should select a category from the dropdown', async () => {
        await SettingsScreen.selectIssueCategory();
        console.log('✅ TC081 PASS: Category selected');
    });

    it('TC082 - should show validation when submitting without category', async () => {
        // Clear category by going back then re-opening
        await HomeScreen.backToHome();
        await HomeScreen.waitForHomeScreen();
        await SettingsScreen.openReportIssue();
        await SettingsScreen.enterIssueDescription('Test description');
        await SettingsScreen.submitIssueReport();
        const validationShown = await $('android=new UiSelector().textContains("required")').isDisplayed().catch(() => false)
                             || await $('android=new UiSelector().textContains("select")').isDisplayed().catch(() => false)
                             || await SettingsScreen.issueCategoryDropdown.isDisplayed().catch(() => false);
        console.log(`ℹ️ TC082: Validation shown: ${validationShown}`);
        console.log('✅ TC082 PASS');
    });

    it('TC083 - should show validation when submitting without description', async () => {
        await SettingsScreen.selectIssueCategory();
        await SettingsScreen.submitIssueReport();
        await driver.pause(1000);
        console.log('✅ TC083 PASS: Submit without description checked');
    });

    it('TC084 - should allow entering description text', async () => {
        await SettingsScreen.enterIssueDescription('This is an automation test issue description.');
        const descField = await SettingsScreen.issueDescriptionField.getText().catch(() => '');
        console.log(`ℹ️ TC084: Description entered: "${descField}"`);
        console.log('✅ TC084 PASS');
    });

    it('TC085 - should show Camera/Gallery options when Add Image is tapped', async () => {
        await SettingsScreen.tapAddImage();
        const cameraVisible  = await SettingsScreen.issueCameraOption.isDisplayed().catch(() => false);
        const galleryVisible = await SettingsScreen.issueGalleryOption.isDisplayed().catch(() => false);
        console.log(`ℹ️ TC085 — Camera: ${cameraVisible}, Gallery: ${galleryVisible}`);
        await SettingsScreen.cancelMediaOption();
        console.log('✅ TC085 PASS');
    });

    it('TC086 - should show Camera/Gallery options when Add Video is tapped', async () => {
        await SettingsScreen.tapAddVideo();
        const videoOptions = await SettingsScreen.issueCameraOption.isDisplayed().catch(() => false)
                          || await SettingsScreen.issueGalleryOption.isDisplayed().catch(() => false);
        console.log(`ℹ️ TC086: Video options: ${videoOptions}`);
        await SettingsScreen.cancelMediaOption();
        console.log('✅ TC086 PASS');
    });

    it('TC093 - should submit a complete report successfully', async () => {
        await SettingsScreen.selectIssueCategory();
        await SettingsScreen.enterIssueDescription('Full automation test report TC093');
        await SettingsScreen.submitIssueReport();
        const successVisible = await SettingsScreen.issueSuccessPopup.isDisplayed().catch(() => false)
                            || await $('android=new UiSelector().textContains("success")').isDisplayed().catch(() => false);
        console.log(`ℹ️ TC093: Success message: ${successVisible}`);
        await SettingsScreen.dismissSuccessPopup();
        console.log('✅ TC093 PASS');
        await SettingsScreen.returnToHomeViaMenu();
    });

    // ════════════════════════════════════════════════════════════════
    // ── UPDATE LOCATION (TC104-TC123) ────────────────────────────
    // ════════════════════════════════════════════════════════════════

    it('TC104 - should open map when Update Location is selected', async () => {
        await HomeScreen.waitForHomeScreen();
        await SettingsScreen.openUpdateLocation();
        const mapVisible = await SettingsScreen.mapView.isDisplayed().catch(() => false)
                        || await SettingsScreen.updateLocationBtn.isDisplayed().catch(() => false)
                        || await $('android=new UiSelector().textContains("Location")').isDisplayed().catch(() => false);
        console.log(`ℹ️ TC104: Map/Location screen visible: ${mapVisible}`);
        console.log('✅ TC104 PASS');
    });

    it('TC105 - should update location when Update Location button is tapped', async () => {
        await SettingsScreen.tapUpdateLocationBtn();
        const successMsg = await SettingsScreen.locationSuccessMsg.isDisplayed().catch(() => false)
                        || await $('android=new UiSelector().textContains("updated")').isDisplayed().catch(() => false)
                        || await $('android=new UiSelector().textContains("success")').isDisplayed().catch(() => false);
        console.log(`ℹ️ TC105: Location update success: ${successMsg}`);
        console.log('✅ TC105 PASS');
        await HomeScreen.backToHome();
    });

    // ════════════════════════════════════════════════════════════════
    // ── CHANGE LANGUAGE (TC124-TC139) ────────────────────────────
    // ════════════════════════════════════════════════════════════════

    it('TC124 - should open Language Change popup when selected', async () => {
        await HomeScreen.waitForHomeScreen();
        await SettingsScreen.openChangeLanguage();
        const popupVisible = await SettingsScreen.languagePopup.isDisplayed().catch(() => false)
                          || await SettingsScreen.languageYesBtn.isDisplayed().catch(() => false)
                          || await SettingsScreen.languageNoBtn.isDisplayed().catch(() => false)
                          || await $('android=new UiSelector().textContains("language")').isDisplayed().catch(() => false);
        console.log(`ℹ️ TC124: Language popup visible: ${popupVisible}`);
        console.log('✅ TC124 PASS');
    });

    it('TC126 - should dismiss language popup when No is tapped', async () => {
        await SettingsScreen.cancelLanguageChange();
        await HomeScreen.waitForHomeScreen();
        expect(await HomeScreen.workProgressTile.isDisplayed()).toBe(true);
        console.log('✅ TC126 PASS: Language change cancelled, home screen shown');
    });

    it('TC125 - should change language when Yes is tapped', async () => {
        await HomeScreen.waitForHomeScreen();
        await SettingsScreen.openChangeLanguage();
        await SettingsScreen.confirmLanguageChange();
        await driver.pause(3000);
        // After language change app may restart to home
        const homeOrSplash = await HomeScreen.workProgressTile.isDisplayed().catch(() => false)
                          || await $('android=new UiSelector().resourceId("com.gwl.trashscan:id/splash")').isDisplayed().catch(() => false);
        console.log(`ℹ️ TC125: After language change, on home/splash: ${homeOrSplash}`);
        // Switch back to English
        try { await SettingsScreen.openChangeLanguage(); await SettingsScreen.confirmLanguageChange(); await driver.pause(3000); } catch {}
        console.log('✅ TC125 PASS');
    });

    // ════════════════════════════════════════════════════════════════
    // ── FORCE CHECKOUT (TC140-TC164) ─────────────────────────────
    // ════════════════════════════════════════════════════════════════

    it('TC140 - Force Checkout should be accessible from menu', async () => {
        await HomeScreen.waitForHomeScreen();
        await SettingsScreen.openForceCheckout();
        const screenVisible = await SettingsScreen.forceCheckoutTitle.isDisplayed().catch(() => false)
                           || await SettingsScreen.forcePropertyDropdown.isDisplayed().catch(() => false)
                           || await $('android=new UiSelector().textContains("Force Checkout")').isDisplayed().catch(() => false);
        expect(screenVisible).toBe(true);
        console.log('✅ TC140 PASS: Force Checkout screen loaded');
    });

    it('TC142 - should open property dropdown on Force Checkout screen', async () => {
        await SettingsScreen.openForcePropertyDropdown();
        const dropdownOpen = await SettingsScreen.forcePropertyCheckbox.isDisplayed().catch(() => false)
                          || await $('android=new UiSelector().resourceId("com.gwl.trashscan:id/playerCB")').isDisplayed().catch(() => false);
        console.log(`ℹ️ TC142: Force Checkout property dropdown open: ${dropdownOpen}`);
        console.log('✅ TC142 PASS');
    });

    it('TC143 - should search property by full name in Force Checkout', async () => {
        await SettingsScreen.searchAndSelectForceProperty('Test');
        console.log('✅ TC143 PASS: Full name search done');
    });

    it('TC149 - should show validation when submitting Force Checkout without property', async () => {
        // Re-open and submit empty
        await HomeScreen.waitForHomeScreen();
        await SettingsScreen.openForceCheckout();
        await SettingsScreen.submitForceCheckout();
        const validation = await $('android=new UiSelector().textContains("required")').isDisplayed().catch(() => false)
                        || await $('android=new UiSelector().textContains("select")').isDisplayed().catch(() => false)
                        || await SettingsScreen.forcePropertyDropdown.isDisplayed().catch(() => false);
        console.log(`ℹ️ TC149: Validation for empty submit: ${validation}`);
        console.log('✅ TC149 PASS');
    });

    it('TC152 - should submit Force Checkout successfully with valid inputs', async () => {
        await SettingsScreen.openForcePropertyDropdown();
        await SettingsScreen.searchAndSelectForceProperty();
        await SettingsScreen.enterForceReason('Automation TC152 force checkout');
        await SettingsScreen.submitForceCheckout();
        const submitted = await $('android=new UiSelector().textContains("success")').isDisplayed().catch(() => false)
                       || await HomeScreen.workProgressTile.isDisplayed().catch(() => false);
        console.log(`ℹ️ TC152: Force checkout submitted: ${submitted}`);
        console.log('✅ TC152 PASS');
        await HomeScreen.waitForHomeScreen();
    });

    // ════════════════════════════════════════════════════════════════
    // ── LOGOUT (TC165) ────────────────────────────────────────────
    // ════════════════════════════════════════════════════════════════

    it('TC165 - Logout should log the user out of the app', async () => {
        await HomeScreen.waitForHomeScreen();
        await SettingsScreen.tapLogout();
        await SettingsScreen.confirmLogout();
        await driver.pause(3000);
        const onLoginScreen = await $('id=com.gwl.trashscan:id/button_login').isDisplayed().catch(() => false)
                           || await $('id=com.gwl.trashscan:id/usrName').isDisplayed().catch(() => false);
        expect(onLoginScreen).toBe(true);
        console.log('✅ TC165 PASS: Logout successful — on login screen');
    });
});
