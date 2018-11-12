import auth from '../config/auth';
import { TXController } from '../controllers/txController';
import { QueController } from '../controllers/queController';

export default class TXRoute {
  public txController: TXController = new TXController();
  public queController: QueController = new QueController();

  public routes(app) {
    app.get('/bankQue', this.queController.init);
    // .get('/gmailAuth', this.gmailController.getGmailAuth)
    // .get('/gmailCode', this.gmailController.getGmailCode);

    app
      .route('/tx')
      .get(auth.required, this.txController.getTransactions)
      .post(auth.required, this.txController.addTransaction);

    app.route('/tx/:source').post(this.txController.addTransaction);

    app
      .route('/tx/:id')
      .get(auth.required, this.txController.getTransactionById)
      .patch(auth.required, this.txController.updateTransaction)
      .delete(auth.required, this.txController.deleteTransaction);
  }
}
