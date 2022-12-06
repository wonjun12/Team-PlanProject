const {Router} = require('express');
const {joinEmailCk, logout, emailCerti, userPwdChange, deleteUser} = require('../controller/controller')

const userRouter = Router();

userRouter.post('/emailCk', joinEmailCk);
userRouter.post('/emailCerti', emailCerti);
userRouter.post('/logout', logout);
userRouter.post('/pwdChange', userPwdChange);
userRouter.post('/deleteUser', deleteUser);


module.exports = userRouter;