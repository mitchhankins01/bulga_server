import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as session from 'express-session';
import * as cors from 'cors';

import TXRoute from './routes/txRoute';
import UserRoute from './routes/userRoute';

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

require('./models/UserModel');
require('./config/passport');

class App {
  public app: express.Application;
  public txRoute: TXRoute = new TXRoute();
  public userRoute: UserRoute = new UserRoute();
  public mongoUri: string = process.env.MONGO_URI;

  constructor() {
    this.app = express();
    this.config();
    this.mongoInit();
    this.txRoute.routes(this.app);
    this.userRoute.routes(this.app);
  }

  private config() {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(
      session({
        cookie: { maxAge: 6000 },
        resave: false,
        saveUninitialized: false,
        secret: process.env.PASSPORT_SECRET
      })
    );
  }

  private mongoInit(): void {
    mongoose.Promise = global.Promise;
    mongoose.connect(
      this.mongoUri,
      { useNewUrlParser: true }
    );
  }
}

export default new App().app;
