const loginFlow = require('../flows/login.flow');
const homeFlow  = require('../flows/home.flow');
const clockFlow = require('../flows/clock.flow');

describe('SMOKE SUITE', () => {

    it('@smoke Full critical flow', async () => {

        await loginFlow.negativeTests();
        await loginFlow.validLogin();

        await homeFlow.verifyHome();
        await clockFlow.performClockIn();

        console.log('✅ SMOKE FLOW PASSED');
    });

});