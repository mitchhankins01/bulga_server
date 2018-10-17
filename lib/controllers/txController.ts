import * as mongoose from 'mongoose';
import * as moment from 'moment';
import { Request, Response } from 'express';

import { TXSchema } from '../models/txModel';

const TXModel = mongoose.model('Transaction', TXSchema);

interface Transaction {
  day: string;
  year: string;
  month: string;
  amount: string;
  fullDate: string;
  merchant: string;
  category?: string;
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
    let tx: Transaction;
    const source: string = req.params.source;

    console.log(`*** Source is: ${source} ***`);

    if (source === 'zapier') {
      tx = req.body.parse.output;
    } else {
      tx = req.body;
    }

    const newTransaction = new TXModel({
      amount: tx.amount,
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
