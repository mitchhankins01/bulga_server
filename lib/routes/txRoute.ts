import { TXController } from '../controllers/txController';

export default class TXRoute {
  public txController: TXController = new TXController();

  public routes(app) {
    app
      .route('/tx')
      .get(this.txController.getTransactions)
      .post(this.txController.addTransaction);

    app
      .route('/tx/:id')
      .get(this.txController.getTransactionById)
      .patch(this.txController.updateTransaction)
      .delete(this.txController.deleteTransaction);
  }
}
