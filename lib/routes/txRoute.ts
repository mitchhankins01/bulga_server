import { TXController } from '../controllers/txController';

export default class TXRoute {
  public txController: TXController = new TXController();

  public routes(app) {
    app.route('/tx').post(this.txController.addTransaction);
    app.route('/tx').get(this.txController.getTransactions);
    app.route('/tx/:id').get(this.txController.getTransactionById);
  }
}
