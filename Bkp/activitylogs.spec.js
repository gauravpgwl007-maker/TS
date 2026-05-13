const HomeScreen = require('../pageobjects/home.screen');
const ActivityLogsScreen = require('../pageobjects/activitylogs.screen');

describe('Activity Logs Tile', () => {

    it('should open Activity Logs and return to Home', async () => {
        await HomeScreen.waitForHomeScreen();

        await ActivityLogsScreen.openActivityLogs();

        await HomeScreen.backToHome();

        expect(true).toBe(true);
    });

});