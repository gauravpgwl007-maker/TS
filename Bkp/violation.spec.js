const HomeScreen = require('../pageobjects/home.screen');
const ViolationScreen = require('../pageobjects/violation.screen');

describe('Violation Tile', () => {

    it('should open Manual Violation', async () => {
        await HomeScreen.waitForHomeScreen();

        await ViolationScreen.openViolationManual();

        // Must use closeManualForm() — hardware back triggers a discard dialog that
        // loops forever (back opens dialog, back dismisses dialog, form stays open)
        await ViolationScreen.closeManualForm();

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