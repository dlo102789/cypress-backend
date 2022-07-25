import {Express, Request, Response} from 'express'

import userRouter from './userRouter'
import authRouter from './authRouter';
import bookRouter from './bookRouter';
import applyPassportStrategy from '../helpers/auth';
import passport from 'passport';

/* GET home page. */
export default function (app: Express) {
    applyPassportStrategy(passport);

    app.get('/', (req: Request, res: Response) => {
        res.status(200).json({success: true, message: "API Homepage"});
    })
    app.use('/users', passport.authenticate('jwt', {session: false}), userRouter);
    app.use('/account', passport.authenticate('jwt', {session: false}),authRouter);
    app.use('/books', passport.authenticate('jwt', {session: false}), bookRouter);
}

