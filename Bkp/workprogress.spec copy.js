const WorkProgressScreen =
require('../pageobjects/workprogress.screen');

describe('Work Progress Module', () => {

    it('Should complete Work Progress Check-In and Check-Out flow successfully', async () => {

        await WorkProgressScreen.completeWorkProgressFlow();

    });

});