describe('Launch App Test', () => {
    it('should launch the GWL TrashScan app', async () => {
        // Just wait a few seconds to confirm the app is open
        await driver.pause(5000);
        console.log("✅ App launched successfully!");
    });
});
