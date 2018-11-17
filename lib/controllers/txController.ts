import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import { spawn } from 'child_process';
import { TXSchema } from '../models/txModel';
import { UserSchema } from '../models/UserModel';

const TXModel = mongoose.model('Transaction', TXSchema);
const UserModel = mongoose.model('User', UserSchema);

interface Transaction {
  amount: string;
  author: string;
  category: string;
  day: string;
  fullDate: string;
  merchant: string;
  month: string;
  year: string;
  bankQueId?: string;
}

export class TXController {
  constructor() {
    this.addTransaction = this.addTransaction.bind(this);
  }

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

  public addTransaction(req: any, res: Response) {
    let tx: Transaction = req.body;

    UserModel.findById(req.payload.id, (err, user) => {
      if (err) {
        console.log(err);
        res.send(401);
      }
      const isNegative = tx.amount[0] === '-';
      const balance = isNegative
        ? user.balance - Number(tx.amount.substr(1))
        : user.balance + Number(tx.amount);
      user.set({ balance });
      user.save(err => console.log);
    });

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
