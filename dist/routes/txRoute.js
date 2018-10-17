"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const txController_1 = require("../controllers/txController");
class TXRoute {
    constructor() {
        this.txController = new txController_1.TXController();
    }
    routes(app) {
        app
            .route('/tx')
            .get(this.txController.getTransactions)
            .post(this.txController.addTransaction);
        app.route('/tx/:source').post(this.txController.addTransaction);
        app
            .route('/tx/:id')
            .get(this.txController.getTransactionById)
            .patch(this.txController.updateTransaction)
            .delete(this.txController.deleteTransaction);
    }
}
exports.default = TXRoute;
//# sourceMappingURL=txRoute.js.map