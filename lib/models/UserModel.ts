import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const UserSchema = new Schema({
  email: {
    required: 'Email missing',
    type: String,
    unique: true
  },
  hash: String,
  salt: String,
  balance: Number
});

UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex');
};

UserSchema.methods.validatePassword = function(password) {
  return (
    this.hash ===
    crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
  );
};

UserSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 7);

  return jwt.sign(
    {
      email: this.email,
      id: this._id,
      expiration: expirationDate.getTime() / 1000
    },
    process.env.PASSPORT_SECRET
  );
};

UserSchema.methods.toAuthJson = function() {
  return {
    _id: this._id,
    email: this.email,
    token: this.generateJWT(),
    balance: this.balance
  };
};

mongoose.model('Users', UserSchema);
