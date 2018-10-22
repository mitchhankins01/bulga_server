import * as mongoose from 'mongoose';
import * as moment from 'moment';
import { Request, Response } from 'express';

import { TXSchema } from '../models/txModel';

const TXModel = mongoose.model('Transaction', TXSchema);

interface Transaction {
  amount: string;
  author: string;
  category: string;
  day: string;
  fullDate: string;
  merchant: string;
  month: string;
  year: string;
}

export class TXController {
  public deleteTransaction(req: Request, res: Response) {
    TXModel.deleteOne({ _id: req.params.id }, error => {
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

  public getTransactions(req: any, res: Response) {
    TXModel.find({ author: req.payload.id }, (error, transactions) => {
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

    /*

    CURRENT IMPLEMENTATION MESSES UP MONTH WHEN POSTED FROM WEB
    INCREASES MONTH BY 1

    */
    let monthFromString: string;

    if (source === 'zapier') {
      tx = req.body.parse.output;
      monthFromString = moment()
        .month(tx.month)
        .format('M');
    } else {
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
