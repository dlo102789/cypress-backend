import express from 'express';
const userRouter = express.Router();

import userCrudController from '../controllers/userCrudController'

userRouter.post('/new', userCrudController.createUser);
userRouter.put('/update', userCrudController.updateUser);
userRouter.delete('/:id', userCrudController.deleteUser);
userRouter.get('/:id', userCrudController.getUser);
userRouter.get('/', userCrudController.getUsers);

export default userRouter;
