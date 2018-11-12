"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const child_process_1 = require("child_process");
const txModel_1 = require("../models/txModel");
const TXModel = mongoose.model('Transaction', txModel_1.TXSchema);
class TXController {
    constructor() {
        this.transactions = [];
        this.addTransaction = this.addTransaction.bind(this);
        this.getBankTransactions = this.getBankTransactions.bind(this);
    }
    getBankTransactions(req, res) {
        this.transactions = [];
        const pythonProcess = child_process_1.spawn(__dirname + '/python', [
            __dirname + '/main.py',
            'token.json'
        ]);
        pythonProcess.stdout.on('data', data => {
            try {
                TXModel.find({ bankQueId: JSON.parse(data.toString()).id }, (err, res) => {
                    if (err) {
                        return console.log(err);
                    }
                    else if (res.length === 0) {
                        return this.transactions.push(JSON.parse(data.toString()));
                    }
                });
            }
            catch (error) {
                console.log(error);
            }
        });
        pythonProcess.stdout.on('end', () => res.send(this.transactions));
        pythonProcess.stderr.on('data', data => console.error(data.toString()));
    }
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
        let tx = req.body;
        // if (tx.bankQueId) {
        //   this.addedInBankQue.push(tx.bankQueId);
        // }
        /*
    
        CURRENT IMPLEMENTATION MESSES UP MONTH WHEN POSTED FROM WEB
        INCREASES MONTH BY 1
    
        */
        const newTransaction = new TXModel({
            author: tx.author,
            amount: tx.amount,
            bankQueId: tx.bankQueId || null,
            category: tx.category,
            day: tx.day,
            fullDate: `${tx.year}-${tx.month}-${tx.day}`,
            merchant: tx.merchant,
            month: tx.month,
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