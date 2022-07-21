import {Express, Request, Response} from 'express'

import userRouter from './userRouter'
import authRouter from './authRouter';

/* GET home page. */
export default function (app: Express) {

    app.get('/', (req: Request, res: Response) => {
        res.status(200).json({success: true, message: "API Homepage"});
    })
    app.use('/users', userRouter);
    app.use('/account', authRouter);
}

