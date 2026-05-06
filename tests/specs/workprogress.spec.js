const HomeScreen = require('../pageobjects/home.screen');
const WorkProgressScreen = require('../pageobjects/workprogress.screen');

describe('Work Progress E2E Flow', () => {

    it('should complete check-in flow and return to home', async () => {

        await HomeScreen.waitForHomeScreen();

        // Step 1: Open Work Progress
        await WorkProgressScreen.openWorkProgress();

        // Step 2: Search "CJ"
        await WorkProgressScreen.searchProperty('CJ');

        // Step 3: Select first property
        await WorkProgressScreen.openFirstProperty();

        // Step 4: Expand first building if the property has a building list, then Check In
        await WorkProgressScreen.expandFirstBuildingIfPresent();
        await WorkProgressScreen.clickCheckIn();

        // Step 5: Enter reason (if popup appears)
        await WorkProgressScreen.enterReasonAndSubmit('test');

        // Step 6: Navigate back to Home (loop back through multiple screens if needed)
        await HomeScreen.backToHome();

    });

});