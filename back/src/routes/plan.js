const {Router} = require('express');
const {setPlan, setDayPlan, myPlan, viewPlanDay, editDayPlan, editPlan, editStartting, editLodging, deletePlan, overallPlan} = require('../controller/controller')

const planRouter = Router();

planRouter.route('/').get(myPlan).post(setPlan);

planRouter.post('/editPlan', editPlan);
planRouter.post('/deletePlan', deletePlan);
planRouter.post('/:id/editDay', editDayPlan);
planRouter.route('/:id/planDays').get(viewPlanDay).post(setDayPlan);
//소진 추가
planRouter.get('/:id/overallPlan', overallPlan);

module.exports = planRouter;