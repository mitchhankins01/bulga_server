import { Request, Response } from 'express';

export default class Index {
  public routes(app) {
    app.get('/', (req: Request, res: Response) => {
      res.status(200).send({ message: 'Sucess' });
    });

    app.post('/tx', (req: Request, res: Response) => {
      const target = req.body.parse.output;
      console.log(target);
      res.send(target);
    });
  }
}
