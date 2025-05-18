const express = require("express");
const dotenv = require("dotenv");
const routesSetup = require("./src/routes");
const setupSessionMiddleware = require("./src/middleware/general/sessionMiddleware");
const setupBodyParserMiddleware = require("./src/middleware/general/bodyParserMiddleware");
const setupCorsMiddleware = require("./src/middleware/general/corsMiddleware");
const setupPassportMiddleware = require("./src/middleware/general/passportMiddleware");
const requestLogger = require("./src/middleware/general/requestLoggerMiddleware");
const { checkAndReact } = require("./src/core/areaTrigger");
const { startTokenRefreshCycle } = require("./src/utils/token/tokenRefreshCycle");
const connectDB = require("./src/config/dbConfig");

dotenv.config();
const app = express();

app.use(requestLogger);
setupSessionMiddleware(app);
setupBodyParserMiddleware(app);
setupCorsMiddleware(app);
setupPassportMiddleware(app);
routesSetup(app);

connectDB();

const PORT = 8080;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on https://api.techparisarea.com:${PORT}`);
    const EVALUATION_INTERVAL = 4000;
    setInterval(checkAndReact, EVALUATION_INTERVAL);
    startTokenRefreshCycle();
});
