import { Request, Response } from 'express';
import * as moment from 'moment';

interface Transaction {
  date: string;
  marchant: string;
  amount: string;
}

export default class Index {
  public routes(app) {
    app.get('/', (req: Request, res: Response) => {
      res.status(200).send({ message: 'Sucess' });
    });

    app.post('/tx', (req: Request, res: Response) => {
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
      console.log(date);
      res.send(date);
    });
  }
}
