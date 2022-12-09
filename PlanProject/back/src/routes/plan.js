const {Router} = require('express');
const {setPlan, setDayPlan, myPlan, viewPlanDay, editDayPlan, editPlan, editStartting, editLodging, deletePlan} = require('../controller/controller')

const planRouter = Router();

planRouter.route('/').get(myPlan).post(setPlan);

planRouter.post('/editPlan', editPlan);
planRouter.post('/deletePlan', deletePlan);
planRouter.post('/:id/editDay', editDayPlan);
planRouter.route('/:id/planDays').get(viewPlanDay).post(setDayPlan);

module.exports = planRouter;