const HomeScreen = require('../pageobjects/home.screen');
const ViolationScreen = require('../pageobjects/violation.screen');

describe('Violation Tile', () => {

    it('should open Manual Violation', async () => {
        await HomeScreen.waitForHomeScreen();

        await ViolationScreen.openViolationManual();

        await HomeScreen.backToHome();

        expect(true).toBe(true);
    });

    it('should open Scan View', async () => {
        await HomeScreen.waitForHomeScreen();

        await ViolationScreen.openViolationScanView();

        await HomeScreen.backToHome();

        expect(true).toBe(true);
    });

    it('should open Quick Snap', async () => {
        await HomeScreen.waitForHomeScreen();

        await ViolationScreen.openViolationQuickSnap();

        await HomeScreen.backToHome();

        expect(true).toBe(true);
    });

});