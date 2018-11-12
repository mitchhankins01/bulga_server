"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../config/auth");
const txController_1 = require("../controllers/txController");
class TXRoute {
    constructor() {
        this.txController = new txController_1.TXController();
    }
    routes(app) {
        app.get('/bankQue', this.txController.getBankTransactions);
        // .get('/gmailAuth', this.gmailController.getGmailAuth)
        // .get('/gmailCode', this.gmailController.getGmailCode);
        app
            .route('/tx')
            .get(auth_1.default.required, this.txController.getTransactions)
            .post(auth_1.default.required, this.txController.addTransaction);
        app.route('/tx/:source').post(this.txController.addTransaction);
        app
            .route('/tx/:id')
            .get(auth_1.default.required, this.txController.getTransactionById)
            .patch(auth_1.default.required, this.txController.updateTransaction)
            .delete(auth_1.default.required, this.txController.deleteTransaction);
    }
}
exports.default = TXRoute;
//# sourceMappingURL=txRoute.js.map