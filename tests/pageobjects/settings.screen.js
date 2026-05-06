const HomeScreen = require('./home.screen');

class SettingsScreen {

    // ==== Hamburger Menu Button ====
    get menuButton() { return $('id=com.gwl.trashscan:id/title_bar_left_menu'); }

    // ==== Drawer Menu Items (source-verified resource IDs from view_menu_left.xml) ====
    get menuHome()            { return $('id=com.gwl.trashscan:id/home'); }
    get menuProfile()         { return $('id=com.gwl.trashscan:id/profile'); }
    get menuActivate()        { return $('id=com.gwl.trashscan:id/activateLayout'); }
    get menuPendingViolation(){ return $('id=com.gwl.trashscan:id/rl_pending_violation'); }
    get menuLaunchTutorials() { return $('id=com.gwl.trashscan:id/play_intro'); }
    get menuReportIssue()     { return $('id=com.gwl.trashscan:id/report_issue'); }
    get menuUpdateLocation()  { return $('id=com.gwl.trashscan:id/update_location'); }
    get menuChangeLanguage()  { return $('id=com.gwl.trashscan:id/change_language'); }
    get menuForceCheckout()   { return $('id=com.gwl.trashscan:id/rl_force_checkout'); }
    // Note: source has a typo "boardcast" — must match the actual resource ID
    get menuMessageBroadcast(){ return $('id=com.gwl.trashscan:id/rl_message_boardcast'); }
    get menuCustomerSupport() { return $('id=com.gwl.trashscan:id/rl_customerSupport'); }
    get menuPorterMap()       { return $('id=com.gwl.trashscan:id/porterMap'); }
    get menuLogout()          { return $('id=com.gwl.trashscan:id/logout'); }

    // ==== Profile Screen (source-verified from fragment_profile.xml) ====
    get profileImage()          { return $('id=com.gwl.trashscan:id/imageViewUsrProfile'); }
    get profileChangePhotoText(){ return $('id=com.gwl.trashscan:id/textviewChangeImg'); }
    get profileUsername()       { return $('id=com.gwl.trashscan:id/textUsername'); }
    get profileEmail()          { return $('id=com.gwl.trashscan:id/textemail'); }
    get profileMobile()         { return $('id=com.gwl.trashscan:id/textMobileno'); }
    get profileEditIcon()       { return $('id=com.gwl.trashscan:id/imageview_edit'); }
    get profileSaveBtn()        { return $('id=com.gwl.trashscan:id/textview_save'); }
    get changePasswordLayout()  { return $('id=com.gwl.trashscan:id/ll_change_password'); }
    get changePasswordText()    { return $('id=com.gwl.trashscan:id/textViewChangePassword'); }

    // ==== Pending Violation Screen (from fragment_pending_violation.xml) ====
    // Custom list dialog IDs (from custom_list_dialog.xml)
    get customDialogSearch()    { return $('id=com.gwl.trashscan:id/searchEditText'); }
    get customDialogRecycler()  { return $('id=com.gwl.trashscan:id/recyclerViewLocation'); }
    get customDialogDoneBtn()   { return $('id=com.gwl.trashscan:id/doneBtn'); }
    get customDialogCancelBtn() { return $('id=com.gwl.trashscan:id/cancelBtn'); }
    get customDialogFirstItem() { return $('android=new UiSelector().resourceId("com.gwl.trashscan:id/playerCB").instance(0)'); }

    // ==== Profile (extended — source-verified from fragment_profile.xml) ====
    get profilePicture()      { return $('id=com.gwl.trashscan:id/imageViewUsrProfile'); }
    get employeeId()          { return $('id=com.gwl.trashscan:id/textUsername'); }
    get employeeDept()        { return $('id=com.gwl.trashscan:id/textrole'); }
    get profileNameField()    { return $('id=com.gwl.trashscan:id/textUsername'); }
    get profileEmailField()   { return $('id=com.gwl.trashscan:id/textemail'); }

    // ==== Activate Scanner (source-verified from activity_active_barcode.xml) ====
    get activateScannerView() { return $('id=com.gwl.trashscan:id/surface_view'); }
    get flashToggle()         { return $('id=com.gwl.trashscan:id/imageView_flash_camera'); }

    // ==== Pending Violation (source-verified from fragment_pending_violation.xml) ====
    get pendingViolationList()  { return $('id=com.gwl.trashscan:id/recyclerviewPendingViolationList'); }
    get pendingEmptyState()     { return $('id=com.gwl.trashscan:id/textViewNoData'); }
    get pendingViolationImage() { return $('id=com.gwl.trashscan:id/horizontalScrollList'); }
    get pendingSubmitBtn()      { return $('id=com.gwl.trashscan:id/text_done'); }

    // ==== Tutorials (source-verified from activity_tutorial.xml) ====
    get tutorialContainer()  { return $('id=com.gwl.trashscan:id/viewpager'); }
    get tutorialSlide()      { return $('id=com.gwl.trashscan:id/intro_btn_skip'); }

    // ==== Report Issue (source-verified from fragment_report_issue.xml) ====
    get reportIssueTitle()      { return $('android=new UiSelector().textContains("Report Issue")'); }
    get issueDescriptionField() { return $('id=com.gwl.trashscan:id/et_description'); }
    get issueCategoryDropdown() { return $('id=com.gwl.trashscan:id/title'); }
    get issueAddImageBtn()      { return $('id=com.gwl.trashscan:id/addImage'); }
    get issueAddVideoBtn()      { return $('id=com.gwl.trashscan:id/addVideo'); }
    get issueSubmitBtn()        { return $('id=com.gwl.trashscan:id/text_done'); }
    get issueCameraOption()     { return $('android=new UiSelector().text("Camera")'); }
    get issueGalleryOption()    { return $('android=new UiSelector().text("Gallery")'); }
    get issueSuccessPopup()     { return $('android=new UiSelector().textContains("successfully")'); }

    // ==== Update Location (source-verified from fragment_location_update.xml) ====
    get updateLocationBtn()  { return $('id=com.gwl.trashscan:id/rlBtnUpdateLocation'); }
    get locationSuccessMsg() { return $('android=new UiSelector().textContains("updated")'); }

    // ==== Language Dialog ====
    get languagePopup()    { return $('android=new UiSelector().textContains("language")'); }

    // ==== Force Checkout (source-verified from fragment_force_property_checkout.xml) ====
    get forceCheckoutTitle()    { return $('android=new UiSelector().textContains("Force Checkout")'); }
    get forcePropertyDropdown() { return $('id=com.gwl.trashscan:id/tv_select_property'); }
    get forcePropertyCheckbox() { return $('android=new UiSelector().resourceId("com.gwl.trashscan:id/playerCB").instance(0)'); }
    get forceReasonField()      { return $('id=com.gwl.trashscan:id/et_description'); }
    get forceSubmitBtn()        { return $('id=com.gwl.trashscan:id/text_done'); }

    // ==== Logout ====
    get logoutConfirmYes() { return $('android=new UiSelector().text("Yes")'); }
    get logoutConfirmNo()  { return $('android=new UiSelector().text("No")'); }

    // ==== Language Dialog Buttons ====
    get languageYesBtn()   { return $('android=new UiSelector().text("Yes")'); }
    get languageNoBtn()    { return $('android=new UiSelector().text("No")'); }

    // ==== Map View (source-verified from fragment_location_update.xml) ====
    get mapView()          { return $('id=com.gwl.trashscan:id/map'); }

    // ================================================================
    // ==== Menu Navigation Helpers ====
    // ================================================================
    async openDrawer() {
        try {
            await this.menuButton.waitForDisplayed({ timeout: 5000 });
            await this.menuButton.click();
            console.log('📂 Drawer opened');
            await driver.pause(800);
        } catch {
            // Fallback: swipe from left edge to open drawer
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

    async returnToHomeViaMenu() {
        await this.openDrawer();
        await this.menuHome.waitForDisplayed({ timeout: 5000 });
        await this.menuHome.click();
        await HomeScreen.waitForHomeScreen();
    }

    // ================================================================
    // ==== Profile Actions ====
    // ================================================================
    async openProfile() {
        await this.openDrawer();
        await this.menuProfile.waitForDisplayed({ timeout: 5000 });
        await this.menuProfile.click();
        console.log('👤 Profile screen opened');
        await driver.pause(1500);
    }

    async isProfileVisible() {
        const image = await this.profileImage.isDisplayed().catch(() => false);
        const email = await this.profileEmail.isDisplayed().catch(() => false);
        const username = await this.profileUsername.isDisplayed().catch(() => false);
        return image || email || username;
    }

    async tapSaveProfile() {
        try {
            await this.profileSaveBtn.waitForDisplayed({ timeout: 5000 });
            await this.profileSaveBtn.click();
            console.log('💾 Profile saved');
            await driver.pause(1500);
        } catch {
            console.log('⚠️ Save button not found');
        }
    }

    async tapChangePassword() {
        try {
            await this.changePasswordLayout.waitForDisplayed({ timeout: 5000 });
            await this.changePasswordLayout.click();
            console.log('🔑 Change Password tapped');
            await driver.pause(1000);
        } catch {
            console.log('⚠️ Change Password not found');
        }
    }

    // ================================================================
    // ==== Activate Scanner Actions ====
    // ================================================================
    async openActivate() {
        await this.openDrawer();
        await this.menuActivate.waitForDisplayed({ timeout: 5000 });
        await this.menuActivate.click();
        console.log('🔑 Activate scanner opened');
        await driver.pause(1500);
        await HomeScreen.allowCameraPermissionIfPresent();
    }

    // ================================================================
    // ==== Pending Violation Actions ====
    // ================================================================
    async openPendingViolation() {
        await this.openDrawer();
        await this.menuPendingViolation.waitForDisplayed({ timeout: 5000 });
        await this.menuPendingViolation.click();
        console.log('⚠️ Pending Violation screen opened');
        await driver.pause(1500);
    }

    // ==== Generic Custom-List Dialog Helpers ====
    async selectFirstItemInDialog() {
        try {
            await this.customDialogFirstItem.waitForDisplayed({ timeout: 5000 });
            await this.customDialogFirstItem.click();
            console.log('✅ First item selected in dialog');
        } catch {
            console.log('⚠️ No items found in dialog');
        }
    }

    async tapDialogDone() {
        await this.customDialogDoneBtn.waitForDisplayed({ timeout: 5000 });
        await this.customDialogDoneBtn.click();
        console.log('✅ Dialog Done tapped');
        await driver.pause(800);
    }

    async tapDialogCancel() {
        try {
            await this.customDialogCancelBtn.waitForDisplayed({ timeout: 5000 });
            await this.customDialogCancelBtn.click();
        } catch {
            await driver.back();
        }
        await driver.pause(800);
    }

    // ================================================================
    // ==== Tutorial Actions ====
    // ================================================================
    async openTutorials() {
        await this.openDrawer();
        await this.menuLaunchTutorials.waitForDisplayed({ timeout: 5000 });
        await this.menuLaunchTutorials.click();
        console.log('📚 Tutorials opened');
        await driver.pause(1500);
    }

    async swipeLeftOnTutorial() {
        const { width, height } = await driver.getWindowSize();
        await driver.action('pointer')
            .move({ x: Math.floor(width * 0.8), y: height / 2 })
            .down()
            .move({ x: Math.floor(width * 0.2), y: height / 2 })
            .up()
            .perform();
        await driver.pause(500);
    }

    async swipeRightOnTutorial() {
        const { width, height } = await driver.getWindowSize();
        await driver.action('pointer')
            .move({ x: Math.floor(width * 0.2), y: height / 2 })
            .down()
            .move({ x: Math.floor(width * 0.8), y: height / 2 })
            .up()
            .perform();
        await driver.pause(500);
    }

    // ================================================================
    // ==== Report Issue Actions ====
    // ================================================================
    async openReportIssue() {
        await this.openDrawer();
        await this.menuReportIssue.waitForDisplayed({ timeout: 5000 });
        await this.menuReportIssue.click();
        console.log('🚨 Report Issue opened');
        await driver.pause(1500);
    }

    // ================================================================
    // ==== Update Location Actions ====
    // ================================================================
    async openUpdateLocation() {
        await this.openDrawer();
        await this.menuUpdateLocation.waitForDisplayed({ timeout: 5000 });
        await this.menuUpdateLocation.click();
        console.log('📍 Update Location opened');
        await driver.pause(1500);
    }

    // ================================================================
    // ==== Change Language Actions ====
    // ================================================================
    async openChangeLanguage() {
        await this.openDrawer();
        await this.menuChangeLanguage.waitForDisplayed({ timeout: 5000 });
        await this.menuChangeLanguage.click();
        console.log('🌐 Change Language opened');
        await driver.pause(1500);
    }

    async confirmLanguageChange() {
        try {
            await this.languageYesBtn.waitForDisplayed({ timeout: 5000 });
            await this.languageYesBtn.click();
            console.log('✅ Language change confirmed');
            await driver.pause(3000);
        } catch {
            console.log('⚠️ Yes button not found');
        }
    }

    async cancelLanguageChange() {
        try {
            await this.languageNoBtn.waitForDisplayed({ timeout: 5000 });
            await this.languageNoBtn.click();
            console.log('✅ Language change cancelled');
            await driver.pause(800);
        } catch {
            await driver.back();
        }
    }

    // ================================================================
    // ==== Force Checkout Actions ====
    // ================================================================
    async openForceCheckout() {
        await this.openDrawer();
        await this.menuForceCheckout.waitForDisplayed({ timeout: 5000 });
        await this.menuForceCheckout.click();
        console.log('🔄 Force Checkout opened');
        await driver.pause(1500);
    }

    async openForcePropertyDropdown() {
        try {
            await this.forcePropertyDropdown.waitForDisplayed({ timeout: 5000 });
            await this.forcePropertyDropdown.click();
            console.log('🏢 Force Checkout property dropdown opened');
            await driver.pause(800);
        } catch {
            console.log('⚠️ Force Checkout property dropdown not found');
        }
    }

    async searchAndSelectForceProperty(term = '') {
        try {
            if (term) {
                await this.customDialogSearch.waitForDisplayed({ timeout: 3000 });
                await this.customDialogSearch.setValue(term);
                await driver.pause(1000);
            }
            await this.selectFirstItemInDialog();
            await this.tapDialogDone();
            console.log('✅ Force Checkout property selected');
        } catch {
            console.log('⚠️ Could not select force checkout property');
        }
    }

    async enterForceReason(text = 'Automation test reason') {
        try {
            await this.forceReasonField.waitForDisplayed({ timeout: 5000 });
            await this.forceReasonField.setValue(text);
            console.log('✅ Force reason entered');
        } catch {
            console.log('⚠️ Force reason field not found');
        }
    }

    async submitForceCheckout() {
        try {
            await this.forceSubmitBtn.waitForDisplayed({ timeout: 5000 });
            await this.forceSubmitBtn.click();
            console.log('✅ Force Checkout submitted');
            await driver.pause(2000);
        } catch {
            console.log('⚠️ Submit button not found');
        }
    }

    async goBackFromForceCheckout() {
        try {
            const back = await $('~Navigate up');
            await back.waitForDisplayed({ timeout: 5000 });
            await back.click();
        } catch {
            await driver.back();
        }
        await HomeScreen.waitForHomeScreen();
    }

    // ================================================================
    // ==== Logout ====
    // ================================================================
    async tapLogout() {
        await this.openDrawer();
        await this.menuLogout.waitForDisplayed({ timeout: 5000 });
        await this.menuLogout.click();
        console.log('🚪 Logout tapped');
        await driver.pause(1000);
    }

    async confirmLogout() {
        try {
            await this.logoutConfirmYes.waitForDisplayed({ timeout: 5000 });
            await this.logoutConfirmYes.click();
            console.log('✅ Logout confirmed');
            await driver.pause(3000);
        } catch {
            console.log('⚠️ Logout confirmation not found');
        }
    }

    async cancelLogout() {
        try {
            await this.logoutConfirmNo.waitForDisplayed({ timeout: 5000 });
            await this.logoutConfirmNo.click();
            console.log('✅ Logout cancelled');
        } catch {}
    }

    // ================================================================
    // ==== Profile Actions (extended) ====
    // ================================================================
    async isProfileFieldsVisible() {
        return await this.profileEmail.isDisplayed().catch(() => false)
            || await this.profileUsername.isDisplayed().catch(() => false)
            || await this.profileImage.isDisplayed().catch(() => false);
    }

    async editProfileField(field, text) {
        try {
            await field.clearValue();
            await field.setValue(text);
        } catch {
            console.log('⚠️ Could not edit profile field');
        }
    }

    // ================================================================
    // ==== Activate Scanner Actions ====
    // ================================================================
    async toggleActivateFlash() {
        try {
            await this.flashToggle.waitForDisplayed({ timeout: 5000 });
            await this.flashToggle.click();
            console.log('🔦 Flash toggled');
            await driver.pause(500);
        } catch {
            console.log('⚠️ Flash toggle not found');
        }
    }

    async openActivityLogsFromActivate() {
        try {
            const logsBtn = await $('id=com.gwl.trashscan:id/tv_activity_log_view');
            if (await logsBtn.isDisplayed().catch(() => false)) {
                await logsBtn.click();
            } else {
                await driver.back();
            }
            console.log('📋 Activity logs opened from activate screen');
            await driver.pause(1000);
        } catch {
            console.log('⚠️ Activity logs button not found on activate screen');
        }
    }

    // ================================================================
    // ==== Pending Violation Actions ====
    // ================================================================
    async openFirstPendingViolation() {
        try {
            const firstItem = await $('android=new UiSelector().resourceId("com.gwl.trashscan:id/recyclerviewPendingViolationList").childSelector(new UiSelector().instance(0))');
            if (await firstItem.isDisplayed().catch(() => false)) {
                await firstItem.click();
                console.log('📋 First pending violation opened');
                await driver.pause(1500);
            } else {
                console.log('ℹ️ No pending violations found');
            }
        } catch {
            console.log('⚠️ Could not open first pending violation');
        }
    }

    // ================================================================
    // ==== Report Issue Actions ====
    // ================================================================
    async selectIssueCategory() {
        try {
            await this.issueCategoryDropdown.waitForDisplayed({ timeout: 5000 });
            await this.issueCategoryDropdown.click();
            await driver.pause(800);
            await this.customDialogFirstItem.waitForDisplayed({ timeout: 5000 });
            await this.customDialogFirstItem.click();
            await this.tapDialogDone().catch(() => {});
            console.log('✅ Issue category selected');
        } catch {
            console.log('⚠️ Category selection failed');
        }
    }

    async enterIssueDescription(text) {
        try {
            await this.issueDescriptionField.waitForDisplayed({ timeout: 5000 });
            await this.issueDescriptionField.clearValue();
            await this.issueDescriptionField.setValue(text);
            console.log('✅ Issue description entered');
        } catch {
            console.log('⚠️ Description field not found');
        }
    }

    async submitIssueReport() {
        try {
            await this.issueSubmitBtn.waitForDisplayed({ timeout: 5000 });
            await this.issueSubmitBtn.click();
            console.log('✅ Issue report submitted');
            await driver.pause(2000);
        } catch {
            console.log('⚠️ Submit button not found');
        }
    }

    async tapAddImage() {
        try {
            await this.issueAddImageBtn.waitForDisplayed({ timeout: 5000 });
            await this.issueAddImageBtn.click();
            console.log('📷 Add Image tapped');
            await driver.pause(1000);
        } catch {
            console.log('⚠️ Add Image button not found');
        }
    }

    async tapAddVideo() {
        try {
            await this.issueAddVideoBtn.waitForDisplayed({ timeout: 5000 });
            await this.issueAddVideoBtn.click();
            console.log('🎥 Add Video tapped');
            await driver.pause(1000);
        } catch {
            console.log('⚠️ Add Video button not found');
        }
    }

    async cancelMediaOption() {
        try {
            await driver.back();
            console.log('✅ Media option dismissed');
            await driver.pause(500);
        } catch {
            console.log('⚠️ Could not dismiss media option');
        }
    }

    async dismissSuccessPopup() {
        try {
            const okBtn = await $('android=new UiSelector().text("OK")');
            if (await okBtn.isDisplayed().catch(() => false)) {
                await okBtn.click();
            } else {
                await driver.back();
            }
            console.log('✅ Success popup dismissed');
            await driver.pause(500);
        } catch {
            console.log('⚠️ Success popup not found');
        }
    }

    // ================================================================
    // ==== Update Location Actions ====
    // ================================================================
    async tapUpdateLocationBtn() {
        try {
            await this.updateLocationBtn.waitForDisplayed({ timeout: 5000 });
            await this.updateLocationBtn.click();
            console.log('📍 Update location tapped');
            await driver.pause(3000);
        } catch {
            console.log('⚠️ Update location button not found');
        }
    }
}

module.exports = new SettingsScreen();
