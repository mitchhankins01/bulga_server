import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';

import TXRoute from './routes/txRoute';

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

class App {
  public app: express.Application;
  public txRoute: TXRoute = new TXRoute();
  public mongoUri: string = process.env.MONGO_URI;

  constructor() {
    this.app = express();
    this.config();
    this.mongoInit();
    this.txRoute.routes(this.app);
  }

  private config() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
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
