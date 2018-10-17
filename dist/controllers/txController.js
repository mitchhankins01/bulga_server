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
        const source = req.params.source;
        console.log(`*** Source is: ${source} ***`);
        if (source === 'discover') {
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
                amount: transaction.amount,
                date: `${date[1]}-${date[0]}-${date[2]}`,
                merchant: transaction.merchant
            });
            newTransaction.save((error, tx) => {
                if (error) {
                    res.send(error);
                }
                res.json(tx);
            });
        }
        else if (source === 'ms') {
            const transaction = req.body.parse.output;
            const d = transaction.date;
            const formatted = `${d.substr(3, 2)}-${d.substr(0, 2)}-${d.substr(6)}`;
            const newTransaction = new TXModel({
                amount: transaction.amount,
                date: formatted,
                merchant: transaction.merchant
            });
            newTransaction.save((error, tx) => {
                if (error) {
                    res.send(error);
                }
                res.json(tx);
            });
        }
        else {
            const transaction = req.body;
            const newTransaction = new TXModel({
                amount: transaction.amount,
                category: transaction.category,
                date: transaction.date,
                merchant: transaction.merchant
            });
            newTransaction.save((error, tx) => {
                if (error) {
                    console.log(error);
                    res.send(error);
                }
                console.log('success');
                res.json(tx);
            });
        }
    }
}
exports.TXController = TXController;
//# sourceMappingURL=txController.js.map