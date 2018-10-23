"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const moment = require("moment");
const txModel_1 = require("../models/txModel");
const TXModel = mongoose.model('Transaction', txModel_1.TXSchema);
class TXController {
    deleteTransaction(req, res) {
        TXModel.deleteOne({ _id: req.params.id }, error => {
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
        TXModel.find({ author: req.payload.id }, (error, transactions) => {
            if (error) {
                res.send(error);
            }
            res.json(transactions);
        });
    }
    addTransaction(req, res) {
        let tx;
        const source = req.params.source;
        console.log(`*** Source is: ${source} ***`);
        /*
    
        CURRENT IMPLEMENTATION MESSES UP MONTH WHEN POSTED FROM WEB
        INCREASES MONTH BY 1
    
        */
        let monthFromString;
        if (source === 'zapier') {
            tx = req.body.parse.output;
            monthFromString = moment()
                .month(tx.month)
                .format('M');
        }
        else {
            tx = req.body;
            monthFromString = tx.month;
        }
        const newTransaction = new TXModel({
            author: tx.author,
            amount: tx.amount,
            category: tx.category,
            day: tx.day,
            fullDate: `${tx.year}-${monthFromString}-${tx.day}`,
            merchant: tx.merchant,
            month: monthFromString,
            year: tx.year
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