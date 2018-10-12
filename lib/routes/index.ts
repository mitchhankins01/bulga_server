import { Request, Response } from 'express';

export default class Index {
  public routes(app) {
    app.get('/', (req: Request, res: Response) => {
      res.status(200).send({ message: 'Sucess' });
    });
  }
}
