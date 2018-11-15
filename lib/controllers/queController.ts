import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import { spawn } from 'child_process';
import { TXSchema } from '../models/txModel';

const TXModel = mongoose.model('Transaction', TXSchema);

export class QueController {
  constructor() {
    this.init = this.init.bind(this);
    this.processMessages = this.processMessages.bind(this);
  }

  public async init(req: Request, res: Response) {
    console.log('JS: START');
    const pythonProcess = spawn('python', ['./main.py', 'token.json']);
    pythonProcess.stdout.on('data', data => {
      console.log(data.toString());
    });
    pythonProcess.stderr.on('data', data => console.error(data.toString()));
    // const pythonProcess = spawn('python', ['./main.py', 'token.json']);
    // pythonProcess.stdout.on('data', data => {
    //   this.processMessages(req, res, JSON.parse(data.toString()));
    // });
    // pythonProcess.stderr.on('data', data => console.error(data.toString()));
    console.log('JS: END');
  }

  private async processMessages(req: Request, res: Response, transactions) {
    const unseen = await Promise.all(
      transactions.map(async each => {
        const bool = await this.isTXSaved(each.id);
        if (!bool) {
          return each;
        }
      })
    );
    console.log(unseen);
    res.send(unseen.filter(each => each !== undefined));
  }

  private isTXSaved(id) {
    return new Promise((resolve, reject) => {
      TXModel.find({ bankQueId: id }, (err, res) => {
        if (err) {
          return reject(err);
        } else if (res.length === 0) {
          return resolve(false);
        } else {
          return resolve(true);
        }
      });
    });
  }
}
