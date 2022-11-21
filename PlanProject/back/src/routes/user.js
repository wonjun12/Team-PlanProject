const {Router} = require('express');
const {mypage, viewPlan, joinEmailCk, logout, emailCerti} = require('../controller/controller')

const userRouter = Router();

userRouter.post('/emailCk', joinEmailCk);
userRouter.post('/emailCerti', emailCerti);
userRouter.post('/logout', logout);
userRouter.get('/mypage', mypage);
userRouter.get('/:id(\\d+)', viewPlan);


module.exports = userRouter;