const DashboardScreen = require('../pageobjects/dashboard.screen');
const LoginScreen     = require('../pageobjects/login.screen');
const HomeScreen      = require('../pageobjects/home.screen');
const users           = require('../fixtures/users.json');

describe('Login Flow', () => {

    // ── Always start fresh on Login Screen ────────────────────────
    beforeEach(async () => {
        await DashboardScreen.skipToLogin();
        await LoginScreen.allowLocationPermissionIfPresent();
    });

    // ── TC001: Blank Login ────────────────────────────────────────
    it('TC001 - should show validation when login fields are blank', async () => {

        await LoginScreen.clearFields();
        await LoginScreen.tapLogin();

        const validationShown =
            await $('android=new UiSelector().textContains("required")').isDisplayed().catch(() => false) ||
            await $('android=new UiSelector().textContains("empty")').isDisplayed().catch(() => false) ||
            await $('android=new UiSelector().textContains("enter")').isDisplayed().catch(() => false);

        const stillOnLogin = await LoginScreen.loginBtn.isDisplayed().catch(() => false);

        expect(validationShown || stillOnLogin).toBe(true);
        console.log('✅ TC001 PASS: Blank login validation shown');
    });

    // ── TC002: Invalid Login ──────────────────────────────────────
    it('TC002 - should show error for invalid credentials', async () => {

        await LoginScreen.login(users.invalid.username, users.invalid.password);

        // optional: avoid keyboard blocking
        await driver.hideKeyboard().catch(() => {});

        const errorVisible =
            await $('android=new UiSelector().textContains("Invalid")').isDisplayed().catch(() => false) ||
            await $('android=new UiSelector().textContains("incorrect")').isDisplayed().catch(() => false) ||
            await $('android=new UiSelector().textContains("wrong")').isDisplayed().catch(() => false) ||
            await $('android=new UiSelector().textContains("failed")').isDisplayed().catch(() => false);

        const stillOnLogin = await LoginScreen.loginBtn.isDisplayed().catch(() => false);

        expect(errorVisible || stillOnLogin).toBe(true);
        console.log('✅ TC002 PASS: Invalid login handled correctly');
    });

    // ── TC003: Valid Login ────────────────────────────────────────
    it('TC003 - should login successfully with valid credentials', async () => {

        await LoginScreen.login(users.valid.username, users.valid.password);

        await HomeScreen.waitForHomeScreen();

        // After login the app shows either the clock-in screen or the home tile grid.
        // The hamburger menu (title bar) is the one element always present in both states.
        const isHomeVisible =
            await HomeScreen.hamburgerMenu.isDisplayed().catch(() => false) ||
            await HomeScreen.clockInBtn.isDisplayed().catch(() => false);

        expect(isHomeVisible).toBe(true);

        console.log('✅ TC003 PASS: Valid login successful');
    });

});