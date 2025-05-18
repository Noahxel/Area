const passport = require("passport");
const User = require("../models/userModels");

module.exports = {
  serialize: passport.serializeUser((user, done) => {
    done(null, user.id);
  }),
  deserialize: passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
      done(null, user);
    });
  }),
};
