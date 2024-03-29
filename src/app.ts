import createError from 'http-errors';
import express, {Request, Response} from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import serveStatic from 'serve-static';

/* 
* ssh-keygen -t rsa -P "" -b 4096 -m PEM -f jwtRS256.key
* ssh-keygen -e -m PEM -f jwtRS256.key > jwtRS256.key.pub
*
*/

import initRoutes from './routes/index';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

interface ErrorStatus {
  status: number,
  message: string
}

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'client/dist')));
app.use(serveStatic(path.join(__dirname, "../client/dist/client")))

initRoutes(app);

// app.use("/", (req: Request, res: Response) => {
//   res.sendFile(path.join(__dirname, "../client/dist/client/index.html"));
// })

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err: ErrorStatus, req: Request, res: Response) {
  // set locals, only providing error in development
  res.locals.message = err.message; 
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err); 
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
