class LoginScreen {
    get username() { return $('id=com.gwl.trashscan:id/usrName'); }
    get password() { return $('id=com.gwl.trashscan:id/password'); }
    get loginBtn() { return $('id=com.gwl.trashscan:id/button_login'); }

    /**
     * Handle location permission popup
     */
    async allowLocationPermissionIfPresent() {
        // Use isDisplayed().catch() — NOT await $() — to avoid immediate findElement API
        // call that throws WebDriverError when the permission dialog is absent.
        const allowBtn = $('android=new UiSelector().resourceId("com.android.permissioncontroller:id/permission_allow_foreground_only_button")');
        if (await allowBtn.isDisplayed().catch(() => false)) {
            await allowBtn.click();
            console.log('📍 Location permission allowed');
        } else {
            console.log('ℹ️ Location permission popup not shown');
        }
    }

    async clearFields() {
        await this.username.waitForDisplayed({ timeout: 10000 });
        await this.username.clearValue();
        await this.password.clearValue();
    }

    /**
     * Performs login with provided credentials.
     */
    async login(user, pass) {
        console.log('🔐 Waiting for username field...');
        await this.username.waitForDisplayed({ timeout: 10000 });

        console.log(`🧑 Entering username: ${user}`);
        await this.username.setValue(user);

        console.log('🔒 Entering password...');
        await this.password.setValue(pass);

        await driver.hideKeyboard().catch(() => {});

        console.log('🚀 Clicking Login button...');
        await this.loginBtn.click();

        // 👇 Handle permission right after login click
        await this.allowLocationPermissionIfPresent();

        await driver.pause(3000);
    }
}

module.exports = new LoginScreen();