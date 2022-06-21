import {Express, Request, Response} from 'express'

import userRouter from './userRouter'

/* GET home page. */
export default function (app: Express) {

    app.get('/', (req: Request, res: Response) => {
        res.send('API Homepage');
    })
    app.use('/users', userRouter);
}

