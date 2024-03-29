import {Express} from 'express'

import userRouter from './userRouter'
import authRouter from './authRouter';
import bookRouter from './bookRouter';
import applyPassportStrategy from '../helpers/auth';
import passport from 'passport';
import reviewRouter from './reviewRouter';

/* GET home page. */
export default function (app: Express) {
    applyPassportStrategy(passport);

    app.use('/users', passport.authenticate('jwt', {session: false}), userRouter);
    app.use('/account', authRouter);
    app.use('/books', passport.authenticate('jwt', {session: false}), bookRouter);
    app.use('/reviews', passport.authenticate('jwt', {session: false}), reviewRouter);
}

