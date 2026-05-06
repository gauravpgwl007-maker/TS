const loginFlow = require('../flows/login.flow');
const homeFlow  = require('../flows/home.flow');
const clockFlow = require('../flows/clock.flow');

describe('FULL REGRESSION SUITE', () => {

    it('@regression Complete app flow', async () => {

        // Login
        await loginFlow.negativeTests();
        await loginFlow.validLogin();

        // Home
        await homeFlow.verifyHome();

        // Clock
        await clockFlow.performClockIn();

        // 👉 Add more modules here:
        // await workProgressFlow.run();
        // await logsFlow.run();
        // await notesFlow.run();
        // await violationFlow.run();

        console.log('✅ FULL REGRESSION PASSED');
    });

});