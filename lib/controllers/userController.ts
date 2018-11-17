import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import * as passport from 'passport';

import { UserSchema } from '../models/UserModel';

const Users = mongoose.model('Users', UserSchema);

interface User {
  email: string;
  password: string;
}

export class UserController {
  public updateBalance(req, res: Response) {
    const {
      body: { balance },
      payload: { id }
    } = req;

    Users.findOneAndUpdate(
      { _id: id },
      { $set: { balance: balance } },
      { new: true },
      (err, doc) => {
        if (err) {
          return res.send(501);
        }
        res.send(doc);
      }
    );
  }

  public deleteUser(req: Request, res: Response) {}

  public updateUser(req: Request, res: Response) {}

  public getUserById(req: any, res: Response) {
    const {
      payload: { id }
    } = req;

    Users.findById(id)
      .then(user => {
        if (!user) {
          res.sendStatus(400);
        }

        res.json({ user: user.toAuthJson() });
      })
      .catch(() => res.sendStatus(400));
  }

  public loginUser(req: Request, res: Response, next) {
    const user: User = req.body.user;

    if (!user.email || !user.password) {
      res.sendStatus(422);
    }

    return passport.authenticate(
      'local',
      { session: false },
      (error, user, info) => {
        if (error) {
          return next(error);
        }

        if (user) {
          user.token = user.generateJWT();
          return res.json({ user: user.toAuthJson() });
        }

        res.sendStatus(400);
      }
    )(req, res, next);
  }

  public addUser(req: Request, res: Response) {
    const user: User = req.body.user;

    if (!user.email || !user.password) {
      return res.sendStatus(422);
    }

    const newUser = new Users(user);
    newUser.setPassword(user.password);

    newUser.save(error => {
      if (error) {
        return res.sendStatus(422);
      }
      res.json({ user: newUser.toAuthJson() });
    });
  }
}
