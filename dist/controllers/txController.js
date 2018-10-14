"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const moment = require("moment");
const txModel_1 = require("../models/txModel");
const Transaction = mongoose.model('Transaction', txModel_1.TXSchma);
class TXController {
    addTransaction(req, res) {
        const transaction = req.body.parse.output;
        const date = transaction.date
            .split(' ')
            .map(str => str.replace(/,/g, ''))
            .map(str => {
            if (str.match(/^[A-Za-z]+$/)) {
                return moment()
                    .month(str)
                    .format('M');
            }
            else {
                return str;
            }
        });
        const newTransaction = new Transaction({
            date: `${date[1]}-${date[0]}-${date[2]}`,
            amount: transaction.amount,
            merchant: transaction.merchant
        });
        console.log(newTransaction);
        newTransaction.save((error, tx) => {
            if (error) {
                res.send(error);
            }
            res.json(tx);
        });
    }
}
exports.TXController = TXController;
//# sourceMappingURL=txController.js.map