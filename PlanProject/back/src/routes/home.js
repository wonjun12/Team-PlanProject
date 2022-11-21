const {Router} = require('express');
const {login, join, loginCk} = require('../controller/controller');

const homeRouter = Router();

homeRouter.post('/loginCk', loginCk);
homeRouter.post('/login', login);
homeRouter.post('/join', join);


module.exports = homeRouter;