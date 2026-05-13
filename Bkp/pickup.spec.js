const HomeScreen = require('../pageobjects/home.screen');
const PickupScreen = require('../pageobjects/pickup.screen');

describe('Pickup Tile', () => {

    it('should open Pickup and return to Home', async () => {
        await HomeScreen.waitForHomeScreen();

        await PickupScreen.openPickup();

        await HomeScreen.backToHome();

        expect(true).toBe(true);
    });

});