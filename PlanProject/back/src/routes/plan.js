const {Router} = require('express');
const {setPlan} = require('../controller/controller')

const planRouter = Router();

planRouter.get('/:id(\\d+)', setPlan);


module.exports = planRouter;