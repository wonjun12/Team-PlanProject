const {Router} = require('express');
const {login, join, loginCk, sendPwd, pwdChange} = require('../controller/controller');

const homeRouter = Router();

homeRouter.post('/loginCk', loginCk);
homeRouter.post('/login', login);
homeRouter.post('/join', join);
homeRouter.post('/sendPwd', sendPwd)
homeRouter.post('/pwdChange', pwdChange);


module.exports = homeRouter;