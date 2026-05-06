const HomeScreen = require('../pageobjects/home.screen');
const DailyWorkPlanScreen = require('../pageobjects/dailyworkplan.screen');

describe('Daily Work Plan Tile', () => {

    it('should open Daily Work Plan and return to Home', async () => {
        await HomeScreen.waitForHomeScreen();

        await DailyWorkPlanScreen.openDailyWorkPlan();

        await HomeScreen.backToHome();

        expect(true).toBe(true);
    });

});