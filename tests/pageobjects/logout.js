class Logout {
    // Menu button to open navigation drawer or menu
    get menuButton() { return $('id=com.gwl.trashscan:id/title_bar_left_menu'); }

    // Logout button inside the menu
    get logoutButton() { return $('id=com.gwl.trashscan:id/logout'); }

    // Confirmation popup buttons
    get confirmLogoutOkButton() { return $('id=android:id/button1'); }
    get confirmLogoutCancelButton() { return $('id=android:id/button2'); }

    /**
     * Logout from the app
     * @param {boolean} confirm - true to tap OK, false to tap Cancel
     */
    async logout(confirm = true) {
        // Open menu first
        await this.menuButton.waitForDisplayed({ timeout: 10000 });
        await this.menuButton.click();

        // Click Logout inside menu
        await this.logoutButton.waitForDisplayed({ timeout: 10000 });
        await this.logoutButton.click();

        // Handle confirmation popup
        if (confirm) {
            await this.confirmLogoutOkButton.waitForDisplayed({ timeout: 10000 });
            await this.confirmLogoutOkButton.click();
        } else {
            await this.confirmLogoutCancelButton.waitForDisplayed({ timeout: 10000 });
            await this.confirmLogoutCancelButton.click();
        }
    }
}

// Export as an instance
module.exports = new Logout();
