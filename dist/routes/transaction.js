"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_1 = require("../controllers/transaction");
class Transaction {
    constructor() {
        this.transactionController = new transaction_1.TransactionController();
    }
    routes(app) {
        app.route('/tx').post(this.transactionController.addTransaction);
    }
}
exports.default = Transaction;
//# sourceMappingURL=transaction.js.map