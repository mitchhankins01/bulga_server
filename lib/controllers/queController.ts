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
    const response = [
      {
        amount: '62.75',
        date: '2018-11-20',
        description: 'Stately Group',
        id: '6/2/./7/5/1/1///2/0///2/0/1/8/S/t/a/t/e/l/y/ /G/r/o/u/p'
      },
      {
        amount: '49.08',
        date: '2018-11-19',
        description: 'Prime Now',
        id: '4/9/./0/8/1/1///1/9///2/0/1/8/P/r/i/m/e/ /N/o/w'
      },
      {
        amount: '36.90',
        date: '2018-11-19',
        description: 'ELECTRIC TOBACCONIST',
        id:
          '3/6/./9/0/1/1///1/9///2/0/1/8/E/L/E/C/T/R/I/C/ /T/O/B/A/C/C/O/N/I/S/T'
      },
      {
        amount: '28.90',
        date: '2018-11-17',
        description: 'GRUBHUB*SHISHKABOBGRIL',
        id:
          '2/8/./9/0/1/1///1/7///2/0/1/8/G/R/U/B/H/U/B/*/S/H/I/S/H/K/A/B/O/B/G/R/I/L'
      },
      {
        amount: '18.90',
        date: '2018-11-17',
        description: 'Alamo Drafthouse',
        id: '1/8/./9/0/1/1///1/7///2/0/1/8/A/l/a/m/o/ /D/r/a/f/t/h/o/u/s/e'
      },
      {
        amount: '5.00',
        date: '2018-11-16',
        description: 'PrimeNowTips',
        id: '5/./0/0/1/1///1/6///2/0/1/8/P/r/i/m/e/N/o/w/T/i/p/s'
      },
      {
        amount: '19.82',
        date: '2018-11-16',
        description: 'GRUBHUB*CAPITOLPIZZA',
        id:
          '1/9/./8/2/1/1///1/6///2/0/1/8/G/R/U/B/H/U/B/*/C/A/P/I/T/O/L/P/I/Z/Z/A'
      }
    ];
    res.send(response);
    // const pythonProcess = spawn('python', ['./main.py', 'token.json']);
    // pythonProcess.stdout.on('data', data => {
    //   this.processMessages(req, res, JSON.parse(data.toString()));
    // });
    // pythonProcess.stderr.on('data', data => console.error(data.toString()));
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
