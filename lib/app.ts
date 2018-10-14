import * as express from 'express';
import * as bodyParser from 'body-parser';

import TXRoute from './routes/txRoute';

class App {
  public app: express.Application;
  public txRoute: TXRoute = new TXRoute();

  constructor() {
    this.app = express();
    this.config();
    this.txRoute.routes(this.app);
  }

  private config() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }
}

export default new App().app;
