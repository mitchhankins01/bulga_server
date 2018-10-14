"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const moment = require("moment");
const txModel_1 = require("../models/txModel");
const TXModel = mongoose.model('Transaction', txModel_1.TXSchema);
class TXController {
    deleteTransaction(req, res) {
        TXModel.remove({ _id: req.params.id }, error => {
            if (error) {
                res.send(error);
            }
            res.json({ message: 'Transaction successfully deleted' });
        });
    }
    updateTransaction(req, res) {
        TXModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (error, transaction) => {
            if (error) {
                res.send(error);
            }
            res.json(transaction);
        });
    }
    getTransactionById(req, res) {
        TXModel.findById(req.params.id, (error, transaction) => {
            if (error) {
                res.send(error);
            }
            res.json(transaction);
        });
    }
    getTransactions(req, res) {
        TXModel.find({}, (error, transactions) => {
            if (error) {
                res.send(error);
            }
            res.json(transactions);
        });
    }
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
        const newTransaction = new TXModel({
            date: `${date[1]}-${date[0]}-${date[2]}`,
            amount: transaction.amount,
            merchant: transaction.merchant
        });
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