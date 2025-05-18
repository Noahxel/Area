const session = require('express-session');

const setupSessionMiddleware = (app) => {
    app.use(session({
        secret: 'RAF',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        }
    }));
};

module.exports = setupSessionMiddleware;
