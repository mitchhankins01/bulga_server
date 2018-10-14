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
