import * as mongoose from 'mongoose';
import * as passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

const Users = mongoose.model('Users');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'user[email]',
      passwordField: 'user[password]'
    },
    (email, password, done) => {
      Users.findOne({ email })
        .then(user => {
          if (!user || !user.validatePassword(password)) {
            return done(null, false);
          }

          return done(null, user);
        })
        .catch(done);
    }
  )
);
