const DashboardScreen = require('../../pageobjects/dashboard.screen');
const LoginScreen     = require('../../pageobjects/login.screen');
const HomeScreen      = require('../../pageobjects/home.screen');
const users           = require('../../fixtures/users.json');

module.exports = {

    async negativeTests() {
        await DashboardScreen.skipToLogin();

        // Invalid
        await LoginScreen.login(users.invalid.username, users.invalid.password);
        const errorVisible = await $('android=new UiSelector().textContains("Invalid")')
            .isDisplayed().catch(() => false);
        expect(errorVisible).toBe(true);

        // Blank
        await LoginScreen.username.clearValue().catch(()=>{});
        await LoginScreen.password.clearValue().catch(()=>{});
        await LoginScreen.loginBtn.click();

        const validation = await $('android=new UiSelector().textContains("required")')
            .isDisplayed().catch(() => false);
        expect(validation).toBe(true);
    },

    async validLogin() {
        await LoginScreen.login(users.valid.username, users.valid.password);
        await HomeScreen.waitForHomeScreen();
    }

};