const cors = require("cors");

const setupCorsMiddleware = (app) => {
    app.use(
        cors({
            origin: `https://techparisarea.com`,
            credentials: true,
        })
    );
};

module.exports = setupCorsMiddleware;
