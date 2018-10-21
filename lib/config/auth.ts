import { Request } from 'mongoose';
import * as jwt from 'express-jwt';

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

const getTokenFromHeaders = (req: Request) => {
  const {
    headers: { authorization }
  } = req;

  if (authorization && authorization.split(' ')[0] === 'Token') {
    return authorization.split(' ')[1];
  }

  return null;
};

const auth = {
  required: jwt({
    getToken: getTokenFromHeaders,
    secret: process.env.PASSPORT_SECRET,
    userProperty: 'payload'
  }),
  optional: jwt({
    credentialsRequired: false,
    getToken: getTokenFromHeaders,
    secret: process.env.PASSPORT_SECRET,
    userProperty: 'payload'
  })
};

export default auth;
