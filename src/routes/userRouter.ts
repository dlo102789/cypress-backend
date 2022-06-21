import express from 'express';
const userRouter = express.Router();

import userCrudController from '../controllers/userCrudController'

userRouter.get('/', (req, res) => {
    res.send("Users API")
});
userRouter.get('/users', userCrudController.getUsers);

export default userRouter;
