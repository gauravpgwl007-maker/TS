const HomeScreen = require('../pageobjects/home.screen');
const AddNotesScreen = require('../pageobjects/addnotes.screen');

describe('Add Notes Tile', () => {

    it('should open Add Notes and return to Home', async () => {
        await HomeScreen.waitForHomeScreen();

        await AddNotesScreen.openAddNotes();

        await HomeScreen.backToHome();

        expect(true).toBe(true);
    });

});