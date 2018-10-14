import * as express from 'express';
import * as bodyParser from 'body-parser';

import Index from './routes';

class App {
  public app: express.Application;
  public index: Index = new Index();

  constructor() {
    this.app = express();
    this.config();
    this.index.routes(this.app);
  }

  private config() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }
}

export default new App().app;
