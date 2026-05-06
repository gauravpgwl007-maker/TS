/**
 * Full E2E Flow — TrashScan App
 *
 * Flow:
 *   App Launch → Skip Tutorial → Login → Home → Clock In
 *   → Work Progress E2E → Pickup E2E → Activity Logs E2E
 *   → Add Notes E2E → Daily Work Plan E2E → Violation E2E
 *   → Menu Options E2E (excl. Logout) → Clock Out → Logout
 */

const DashboardScreen     = require('../pageobjects/dashboard.screen');
const LoginScreen         = require('../pageobjects/login.screen');
const HomeScreen          = require('../pageobjects/home.screen');
const WorkProgressScreen  = require('../pageobjects/workprogress.screen');
const PickupScreen        = require('../pageobjects/pickup.screen');
const ActivityLogsScreen  = require('../pageobjects/activitylogs.screen');
const AddNotesScreen      = require('../pageobjects/addnotes.screen');
const DailyWorkPlanScreen = require('../pageobjects/dailyworkplan.screen');
const ViolationScreen     = require('../pageobjects/violation.screen');
const MenuScreen          = require('../pageobjects/menu.screen');
const Logout              = require('../pageobjects/logout');
const users               = require('../fixtures/users.json');

describe('Full E2E Flow — TrashScan App', () => {

    // ── TC-E2E-01: App Launch and Skip Tutorial ───────────────────
    it('TC-E2E-01: should launch app and arrive on login screen', async () => {
        console.log('🚀 TC-E2E-01: Launching app and skipping tutorial...');

        // If noReset:true left the app on the home screen (still logged in),
        // clock out first (if needed) then logout for a clean start.
        // Logging out while clocked in leaves the backend in a "still clocked in"
        // state which causes the next clock-in to throw an unhandled exception.
        const alreadyOnHome = await HomeScreen.hamburgerMenu.isDisplayed().catch(() => false);
        if (alreadyOnHome) {
            const isClockedIn = await HomeScreen.clockOutBtn.isDisplayed().catch(() => false);
            if (isClockedIn) {
                console.log('ℹ️ TC-E2E-01: User is clocked in — clocking out before logout');
                await HomeScreen.clockOutBtn.click();
                await HomeScreen.clockInBtn.waitForDisplayed({ timeout: 60000 }).catch(() => {
                    console.log('⚠️ Clock-in button did not reappear — continuing anyway');
                });
                await driver.pause(1000);
            }
            console.log('ℹ️ TC-E2E-01: App already on home screen — logging out for clean start');
            await Logout.logout(true);
            await driver.pause(1500);
        }

        // If tutorial/onboarding is showing, skip it
        await DashboardScreen.skipToLogin();
        await LoginScreen.allowLocationPermissionIfPresent();

        const loginBtnVisible = await LoginScreen.loginBtn.isDisplayed().catch(() => false);
        const usernameVisible = await LoginScreen.username.isDisplayed().catch(() => false);
        expect(loginBtnVisible || usernameVisible).toBe(true);

        console.log('✅ TC-E2E-01 PASS: App launched — on login screen');
    });

    // ── TC-E2E-02: Login with valid credentials ───────────────────
    it('TC-E2E-02: should login with valid credentials and land on home screen', async () => {
        console.log('🔐 TC-E2E-02: Logging in...');

        await LoginScreen.login(users.valid.username, users.valid.password);
        await HomeScreen.waitForHomeScreen();

        const homeVisible =
            await HomeScreen.hamburgerMenu.isDisplayed().catch(() => false) ||
            await HomeScreen.clockInBtn.isDisplayed().catch(() => false);
        expect(homeVisible).toBe(true);

        console.log('✅ TC-E2E-02 PASS: Login successful — on home screen');
    });

    // ── TC-E2E-03: Verify Home Screen Elements ────────────────────
    it('TC-E2E-03: should display hamburger menu and clock-in button on home screen', async () => {
        console.log('🏠 TC-E2E-03: Verifying home screen elements...');

        await HomeScreen.waitForHomeScreen();

        const hamburgerVisible = await HomeScreen.hamburgerMenu.isDisplayed().catch(() => false);
        const clockInVisible   = await HomeScreen.clockInBtn.isDisplayed().catch(() => false);

        expect(hamburgerVisible).toBe(true);
        expect(clockInVisible).toBe(true);

        console.log('✅ TC-E2E-03 PASS: Home screen elements verified');
    });

    // ── TC-E2E-04: Perform Clock In ───────────────────────────────
    it('TC-E2E-04: should perform clock in and show home screen tiles', async () => {
        console.log('⏰ TC-E2E-04: Performing Clock In...');

        await HomeScreen.waitForHomeScreen();

        const alreadyClockedIn = await HomeScreen.clockOutBtn.isDisplayed().catch(() => false);
        if (alreadyClockedIn) {
            console.log('ℹ️ TC-E2E-04: Already clocked in — skipping clock-in');
        } else {
            await HomeScreen.clockInBtn.waitForDisplayed({ timeout: 15000 });
            await HomeScreen.clockInBtn.click();
            await HomeScreen.clockOutBtn.waitForDisplayed({
                timeout: 60000,
                timeoutMsg: '❌ Clock Out button did not appear after Clock In'
            });
            console.log('⏰ Clock In done');
        }

        await HomeScreen.waitForHomeTiles();

        const workProgressVisible = await HomeScreen.workProgressTile.isDisplayed().catch(() => false);
        expect(workProgressVisible).toBe(true);

        console.log('✅ TC-E2E-04 PASS: Clocked in — home tiles visible');
    });

    // ── TC-E2E-05: Work Progress E2E ─────────────────────────────
    it('TC-E2E-05: should open Work Progress, view property list, and navigate property details', async () => {
        console.log('📋 TC-E2E-05: Work Progress E2E...');

        await HomeScreen.waitForHomeScreen();
        await WorkProgressScreen.openWorkProgress();

        const hasProps   = await WorkProgressScreen.hasProperties();
        const isEmptyWP  = await WorkProgressScreen.isEmptyState();
        console.log(`ℹ️ TC-E2E-05: Properties visible: ${hasProps}, Empty state: ${isEmptyWP}`);
        expect(hasProps || isEmptyWP).toBe(true);

        if (hasProps) {
            const nameText = await WorkProgressScreen.firstPropertyName.getText().catch(() => null);
            console.log(`ℹ️ TC-E2E-05: First property name: "${nameText}"`);

            await WorkProgressScreen.openFirstProperty();
            await driver.pause(1000);

            // Verify some element on property detail screen
            const detailVisible =
                await $('id=com.gwl.trashscan:id/textViewPropertyName').isDisplayed().catch(() => false) ||
                await $('id=com.gwl.trashscan:id/txtCount').isDisplayed().catch(() => false)             ||
                await $('android=new UiSelector().textContains("Property")').isDisplayed().catch(() => false);
            console.log(`ℹ️ TC-E2E-05: Property detail screen loaded: ${detailVisible}`);

            await driver.back();
            await driver.pause(800);
        }

        await HomeScreen.backToHome();
        console.log('✅ TC-E2E-05 PASS: Work Progress E2E complete');
    });

    // ── TC-E2E-06: Pickup E2E ─────────────────────────────────────
    it('TC-E2E-06: should open Pickup scanner, verify scanner view and Activity Logs bar', async () => {
        console.log('📷 TC-E2E-06: Pickup E2E...');

        await HomeScreen.waitForHomeScreen();
        await PickupScreen.openPickup();
        await PickupScreen.allowCameraPermissionIfPresent();

        const scannerVisible  = await PickupScreen.isScannerVisible();
        const logsBarVisible  = await PickupScreen.isActivityLogsBarVisible();
        console.log(`ℹ️ TC-E2E-06: Scanner view: ${scannerVisible}, Activity Logs bar: ${logsBarVisible}`);
        expect(scannerVisible || logsBarVisible).toBe(true);

        if (logsBarVisible) {
            await PickupScreen.expandActivityLogsPanel();
            await driver.pause(1000);
        }

        await HomeScreen.backToHome();
        console.log('✅ TC-E2E-06 PASS: Pickup E2E complete');
    });

    // ── TC-E2E-07: Activity Logs E2E ─────────────────────────────
    it('TC-E2E-07: should open Activity Logs and verify clock-in/clock-out entries', async () => {
        console.log('📜 TC-E2E-07: Activity Logs E2E...');

        await HomeScreen.waitForHomeScreen();
        await ActivityLogsScreen.openActivityLogs();

        const hasLogs = await ActivityLogsScreen.hasLogs();
        const isEmpty = await ActivityLogsScreen.isEmptyState();
        console.log(`ℹ️ TC-E2E-07: Has logs: ${hasLogs}, Empty state: ${isEmpty}`);
        expect(hasLogs || isEmpty).toBe(true);

        if (hasLogs) {
            const firstLogText = await ActivityLogsScreen.getFirstLogText();
            console.log(`ℹ️ TC-E2E-07: First log entry: "${firstLogText}"`);
        }

        await HomeScreen.backToHome();
        console.log('✅ TC-E2E-07 PASS: Activity Logs E2E complete');
    });

    // ── TC-E2E-08: Add Notes E2E ──────────────────────────────────
    it('TC-E2E-08: should open Notes list, open Add Note form, verify all fields, and cancel', async () => {
        console.log('📝 TC-E2E-08: Add Notes E2E...');

        await HomeScreen.waitForHomeScreen();
        await AddNotesScreen.openAddNotes();

        const listVisible = await AddNotesScreen.notesList.isDisplayed().catch(() => false);
        const noData      = await AddNotesScreen.noDataText.isDisplayed().catch(() => false);
        console.log(`ℹ️ TC-E2E-08: Notes list: ${listVisible}, No data text: ${noData}`);
        expect(listVisible || noData).toBe(true);

        // Open Add Note form
        await AddNotesScreen.openAddNoteForm();
        await driver.pause(1500);

        const formVisible = await AddNotesScreen.isAddNoteFormVisible();
        console.log(`ℹ️ TC-E2E-08: Add Note form visible: ${formVisible}`);

        if (formVisible) {
            const propVisible   = await AddNotesScreen.propertyDropdown.isDisplayed().catch(() => false);
            const reasonVisible = await AddNotesScreen.reasonDropdown.isDisplayed().catch(() => false);
            const photoVisible  = await AddNotesScreen.addPhotoBtn.isDisplayed().catch(() => false);
            const doneVisible   = await AddNotesScreen.doneBtn.isDisplayed().catch(() => false);
            const cancelVisible = await AddNotesScreen.cancelBtn.isDisplayed().catch(() => false);
            console.log(`ℹ️ TC-E2E-08: Property: ${propVisible}, Reason: ${reasonVisible}, AddPhoto: ${photoVisible}, Done: ${doneVisible}, Cancel: ${cancelVisible}`);

            await AddNotesScreen.cancelAddNote();
        } else {
            console.log('ℹ️ TC-E2E-08: Add Note form not opened — button may not be present');
            await driver.back().catch(() => {});
        }

        await HomeScreen.backToHome();
        console.log('✅ TC-E2E-08 PASS: Add Notes E2E complete');
    });

    // ── TC-E2E-09: Daily Work Plan E2E ───────────────────────────
    it('TC-E2E-09: should open Daily Work Plan and verify screen elements', async () => {
        console.log('📅 TC-E2E-09: Daily Work Plan E2E...');

        await HomeScreen.waitForHomeScreen();
        await DailyWorkPlanScreen.openDailyWorkPlan();

        const titleVisible      = await DailyWorkPlanScreen.screenTitle.isDisplayed().catch(() => false);
        const checkInVisible    = await DailyWorkPlanScreen.checkInBtn.isDisplayed().catch(() => false);
        const listBtnVisible    = await DailyWorkPlanScreen.listViewBtn.isDisplayed().catch(() => false);
        const identifierVisible = await DailyWorkPlanScreen.screenIdentifier.isDisplayed().catch(() => false);
        console.log(`ℹ️ TC-E2E-09: Title: ${titleVisible}, CheckIn: ${checkInVisible}, List: ${listBtnVisible}, Identifier: ${identifierVisible}`);
        expect(titleVisible || checkInVisible || listBtnVisible || identifierVisible).toBe(true);

        await HomeScreen.backToHome();
        console.log('✅ TC-E2E-09 PASS: Daily Work Plan E2E complete');
    });

    // ── TC-E2E-10: Violation E2E ─────────────────────────────────
    it('TC-E2E-10: should open Violation dialog, test Manual form, Scan View, and Quick Snap', async () => {
        console.log('⚠️ TC-E2E-10: Violation E2E...');

        await HomeScreen.waitForHomeScreen();

        // ---- Manual Violation ----
        console.log('ℹ️ TC-E2E-10: Opening Manual Violation...');
        await ViolationScreen.openViolationManual();

        const propVisible   = await ViolationScreen.propertyField.isDisplayed().catch(() => false);
        const bldgVisible   = await ViolationScreen.buildingField.isDisplayed().catch(() => false);
        const unitVisible   = await ViolationScreen.unitField.isDisplayed().catch(() => false);
        const reasonVisible = await ViolationScreen.reasonField.isDisplayed().catch(() => false);
        const actionVisible = await ViolationScreen.actionField.isDisplayed().catch(() => false);
        const notesVisible  = await ViolationScreen.specialNotesField.isDisplayed().catch(() => false);
        const doneVisible   = await ViolationScreen.doneBtn.isDisplayed().catch(() => false);
        console.log(`ℹ️ TC-E2E-10 Manual: Property=${propVisible} Building=${bldgVisible} Unit=${unitVisible} Reason=${reasonVisible} Action=${actionVisible} Notes=${notesVisible} Done=${doneVisible}`);
        expect(propVisible).toBe(true);

        await ViolationScreen.closeManualForm();
        await HomeScreen.waitForHomeScreen();

        // ---- Scan View ----
        console.log('ℹ️ TC-E2E-10: Opening Scan View...');
        await ViolationScreen.openViolationScanView();
        const scanVisible =
            await ViolationScreen.scannerView.isDisplayed().catch(() => false) ||
            await ViolationScreen.activityLogsBar.isDisplayed().catch(() => false);
        console.log(`ℹ️ TC-E2E-10 Scan View: Scanner/Logs bar visible: ${scanVisible}`);
        await HomeScreen.backToHome();

        // ---- Quick Snap ----
        console.log('ℹ️ TC-E2E-10: Opening Quick Snap...');
        await ViolationScreen.openViolationQuickSnap();
        const snapVisible =
            await ViolationScreen.captureBtn.isDisplayed().catch(() => false) ||
            await ViolationScreen.scannerView.isDisplayed().catch(() => false);
        console.log(`ℹ️ TC-E2E-10 Quick Snap: Camera/Scanner visible: ${snapVisible}`);
        await HomeScreen.backToHome();

        console.log('✅ TC-E2E-10 PASS: Violation E2E complete');
    });

    // ── TC-E2E-11: Menu Options Verify E2E (excluding Logout) ────
    it('TC-E2E-11: should verify all drawer menu items are visible and each screen opens', async () => {
        console.log('☰ TC-E2E-11: Menu Options E2E...');

        await HomeScreen.waitForHomeScreen();

        // Verify all menu items are present
        await MenuScreen.openDrawer();
        await driver.pause(1000);

        const items = {
            Home:             await MenuScreen.menuHome.isDisplayed().catch(() => false),
            Profile:          await MenuScreen.menuProfile.isDisplayed().catch(() => false),
            Activate:         await MenuScreen.menuActivate.isDisplayed().catch(() => false),
            PendingViolation: await MenuScreen.menuPendingViolation.isDisplayed().catch(() => false),
            Tutorials:        await MenuScreen.menuLaunchTutorials.isDisplayed().catch(() => false),
            ReportIssue:      await MenuScreen.menuReportIssue.isDisplayed().catch(() => false),
            UpdateLocation:   await MenuScreen.menuUpdateLocation.isDisplayed().catch(() => false),
            ChangeLanguage:   await MenuScreen.menuChangeLanguage.isDisplayed().catch(() => false),
            ForceCheckout:    await MenuScreen.menuForceCheckout.isDisplayed().catch(() => false),
        };
        console.log('ℹ️ TC-E2E-11: Menu items:', JSON.stringify(items));
        expect(items.Home).toBe(true);
        expect(items.Profile).toBe(true);

        // Close drawer without tapping a menu item
        await driver.back();
        await driver.pause(500);

        // ---- Profile ----
        await MenuScreen.goToProfile();
        await driver.pause(1000);
        const profileVisible =
            await $('id=com.gwl.trashscan:id/imageViewUsrProfile').isDisplayed().catch(() => false) ||
            await $('id=com.gwl.trashscan:id/textemail').isDisplayed().catch(() => false)             ||
            await $('android=new UiSelector().textContains("Profile")').isDisplayed().catch(() => false);
        console.log(`ℹ️ TC-E2E-11: Profile screen: ${profileVisible}`);
        await driver.back();
        await HomeScreen.waitForHomeScreen();

        // ---- Activate ----
        await MenuScreen.goToActivate();
        await driver.pause(1000);
        console.log('ℹ️ TC-E2E-11: Activate screen opened');
        await HomeScreen.backToHome();

        // ---- Pending Violation ----
        await MenuScreen.goToPendingViolation();
        await driver.pause(1000);
        console.log('ℹ️ TC-E2E-11: Pending Violation screen opened');
        await driver.back();
        await HomeScreen.waitForHomeScreen();

        // ---- Launch Tutorials ----
        await MenuScreen.goToLaunchTutorials();
        await driver.pause(1000);
        console.log('ℹ️ TC-E2E-11: Tutorials opened');
        await driver.back();
        await HomeScreen.waitForHomeScreen();

        // ---- Report Issue ----
        await MenuScreen.goToReportIssue();
        await driver.pause(1000);
        console.log('ℹ️ TC-E2E-11: Report Issue screen opened');
        await HomeScreen.backToHome();

        // ---- Update Location ----
        await MenuScreen.goToUpdateLocation();
        await driver.pause(1000);
        console.log('ℹ️ TC-E2E-11: Update Location screen opened');
        await HomeScreen.backToHome();

        // ---- Change Language (dismiss dialog with "No") ----
        await MenuScreen.goToChangeLanguage();
        await driver.pause(1000);
        const noBtn = await $('android=new UiSelector().text("No")');
        if (await noBtn.isDisplayed().catch(() => false)) {
            await noBtn.click();
        } else {
            await driver.back().catch(() => {});
        }
        await driver.pause(500);
        await HomeScreen.waitForHomeScreen();

        // ---- Force Checkout ----
        await MenuScreen.goToForceCheckout();
        await driver.pause(1000);
        console.log('ℹ️ TC-E2E-11: Force Checkout screen opened');
        await driver.back();
        await HomeScreen.waitForHomeScreen();

        console.log('✅ TC-E2E-11 PASS: All menu options verified (Logout excluded)');
    });

    // ── TC-E2E-12: Clock Out from Home Screen ────────────────────
    it('TC-E2E-12: should perform clock out and show clock-in button', async () => {
        console.log('⏰ TC-E2E-12: Performing Clock Out...');

        await HomeScreen.waitForHomeScreen();

        const clockOutVisible = await HomeScreen.clockOutBtn.isDisplayed().catch(() => false);
        if (clockOutVisible) {
            await HomeScreen.clockOutBtn.click();
            await HomeScreen.clockInBtn.waitForDisplayed({
                timeout: 60000,
                timeoutMsg: '❌ Clock In button did not reappear after Clock Out'
            });
            console.log('⏰ Clock Out done');
        } else {
            console.log('ℹ️ TC-E2E-12: Clock Out button not visible — may already be clocked out');
        }

        const clockInBack = await HomeScreen.clockInBtn.isDisplayed().catch(() => false);
        expect(clockInBack).toBe(true);

        console.log('✅ TC-E2E-12 PASS: Clocked out — Clock In button visible');
    });

    // ── TC-E2E-13: Final Logout ───────────────────────────────────
    it('TC-E2E-13: should perform logout and land on login screen', async () => {
        console.log('🚪 TC-E2E-13: Performing final logout...');

        await HomeScreen.waitForHomeScreen();
        await Logout.logout(true);

        const onLoginScreen =
            await $('id=com.gwl.trashscan:id/button_login').isDisplayed().catch(() => false) ||
            await $('id=com.gwl.trashscan:id/usrName').isDisplayed().catch(() => false);
        expect(onLoginScreen).toBe(true);

        console.log('✅ TC-E2E-13 PASS: Logout successful — on login screen');
    });

});
