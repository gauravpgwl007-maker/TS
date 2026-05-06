const HomeScreen = require('../../pageobjects/home.screen');

module.exports = {

    async verifyHome() {
        await HomeScreen.waitForHomeScreen();

        const tiles = [
            HomeScreen.workProgressTile,
            HomeScreen.pickupTile,
            HomeScreen.activityLogsTile,
            HomeScreen.addNotesTile,
            HomeScreen.dailyWorkPlanTile,
            HomeScreen.violationTile
        ];

        let visible = 0;
        for (const t of tiles) {
            if (await t.isDisplayed().catch(()=>false)) visible++;
        }

        expect(visible).toBeGreaterThanOrEqual(4);
    }

};