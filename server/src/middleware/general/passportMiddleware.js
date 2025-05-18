const passport = require("passport");

const setupPassportMiddleware = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());
};

module.exports = setupPassportMiddleware;
