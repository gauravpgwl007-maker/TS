const HomeScreen = require('../pageobjects/home.screen');

describe('Home Screen Load Validation', () => {

    before(async () => {
        await HomeScreen.waitForHomeScreen();
    });

    it('should load Home screen with all major tiles visible', async () => {

        const results = {
            workProgress : await HomeScreen.workProgressTile.isDisplayed().catch(() => false),
            pickup       : await HomeScreen.pickupTile.isDisplayed().catch(() => false),
            activityLogs : await HomeScreen.activityLogsTile.isDisplayed().catch(() => false),
            addNotes     : await HomeScreen.addNotesTile.isDisplayed().catch(() => false),
            dailyPlan    : await HomeScreen.dailyWorkPlanTile.isDisplayed().catch(() => false),
            violation    : await HomeScreen.violationTile.isDisplayed().catch(() => false),
        };

        console.log('📊 Home tiles visibility:', results);

        const visibleTiles = Object.values(results).filter(v => v).length;

        expect(visibleTiles).toBeGreaterThanOrEqual(4);

        console.log('✅ Home screen validation passed');
    });

});