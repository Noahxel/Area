const bodyParser = require("body-parser");

const setupBodyParserMiddleware = (app) => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
};

module.exports = setupBodyParserMiddleware;
