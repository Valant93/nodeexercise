const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const db = require('../db/db');
require('dotenv').config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET
};

passport.use(
  new Strategy(opts, async (jwt_payload, done) => {
    try {
      const res = await db.query('SELECT * FROM users WHERE id = $1', [jwt_payload.id]);
      if (res.rows.length > 0) {
        return done(null, res.rows[0]);
      }
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);

module.exports = passport;