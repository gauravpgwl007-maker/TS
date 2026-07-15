const HomeScreen = require('../pageobjects/home.screen');
const WorkProgressScreen = require('../pageobjects/workprogress.screen');

describe('Work Progress Tile', () => {

    it('should open Work Progress and return to Home', async () => {
        await HomeScreen.waitForHomeScreen();

        await WorkProgressScreen.openWorkProgress();

        await driver.back();
        await HomeScreen.waitForHomeScreen();

        expect(true).toBe(true);
    });

});