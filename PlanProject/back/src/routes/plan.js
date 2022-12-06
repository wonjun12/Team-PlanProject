const {Router} = require('express');
const {setPlan, setDayPlan, myPlan, viewPlanDay, editDayPlan, editPlan, editStartting, editLodging, deletePlan} = require('../controller/controller')

const planRouter = Router();

planRouter.route('/plan').get(myPlan).post(setPlan);

planRouter.post('/editPlan', editPlan);
planRouter.post('/editStartting', editStartting);
planRouter.post('/editLodging', editLodging);
planRouter.post('/deletePlan', deletePlan);
planRouter.post('/:id/editDay', editDayPlan);
planRouter.route('/:id/planDays').get(viewPlanDay).post(setDayPlan);

module.exports = planRouter;