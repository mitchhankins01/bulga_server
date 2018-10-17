import * as mongoose from 'mongoose';
import * as moment from 'moment';
import { Request, Response } from 'express';

import { TXSchema } from '../models/txModel';

const TXModel = mongoose.model('Transaction', TXSchema);

interface Transaction {
  date: string;
  merchant: string;
  amount: string;
}

export class TXController {
  public deleteTransaction(req: Request, res: Response) {
    TXModel.remove({ _id: req.params.id }, error => {
      if (error) {
        res.send(error);
      }
      res.json({ message: 'Transaction successfully deleted' });
    });
  }

  public updateTransaction(req: Request, res: Response) {
    TXModel.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true },
      (error, transaction) => {
        if (error) {
          res.send(error);
        }
        res.json(transaction);
      }
    );
  }

  public getTransactionById(req: Request, res: Response) {
    TXModel.findById(req.params.id, (error, transaction) => {
      if (error) {
        res.send(error);
      }
      res.json(transaction);
    });
  }

  public getTransactions(req: Request, res: Response) {
    TXModel.find({}, (error, transactions) => {
      if (error) {
        res.send(error);
      }
      res.json(transactions);
    });
  }

  public addTransaction(req: Request, res: Response) {
    const source: string = req.params.source;

    console.log(`*** Source is: ${source} ***`);

    if (source === 'discover') {
      const transaction: Transaction = req.body.parse.output;
      const date = transaction.date
        .split(' ')
        .map(str => str.replace(/,/g, ''))
        .map(str => {
          if (str.match(/^[A-Za-z]+$/)) {
            return moment()
              .month(str)
              .format('M');
          } else {
            return str;
          }
        });

      const newTransaction = new TXModel({
        amount: transaction.amount,
        date: `${date[1]}-${date[0]}-${date[2]}`,
        merchant: transaction.merchant,
        month: date[0]
      });

      newTransaction.save((error, tx) => {
        if (error) {
          res.send(error);
        }
        res.json(tx);
      });
    } else if (source === 'ms') {
      const transaction: Transaction = req.body.parse.output;
      const d = transaction.date;
      const formatted = `${d.substr(3, 2)}-${d.substr(0, 2)}-${d.substr(6)}`;

      const newTransaction = new TXModel({
        amount: transaction.amount,
        date: formatted,
        merchant: transaction.merchant,
        month: d.substr(0, 2)
      });

      newTransaction.save((error, tx) => {
        if (error) {
          res.send(error);
        }
        res.json(tx);
      });
    }
  }
}
