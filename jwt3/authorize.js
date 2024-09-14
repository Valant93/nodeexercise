const passport = require('passport');


module.exports = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Unauthorized access' });
    }

    req.user = user; 
    next();
  })(req, res, next);
};