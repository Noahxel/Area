const routesConfig = require("../config/routeConfig");

const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

const setupRoutes = (app) => {
    routesConfig.forEach((route) => {
        const routerModule = require(route.router);
        let router;
        if (route.router === "swagger-ui-express") {
            router = routerModule.serve;
        } else {
            router = routerModule;
        }

        const middlewares = route.middlewares ? route.middlewares.map(mw => require(mw)) : [];
        let handler;
        if (route.handler) {
            const handlerModule = require(route.handler);
            if (route.handler === "swagger-ui-express") {
                handler = handlerModule.setup(require(route.handlerConfig));
            } else {
                handler = asyncHandler(handlerModule);
            }
        }

        const allMiddleware = [...middlewares, router];
        if (handler) {
            allMiddleware.push(handler);
        }

        app.use(route.path, ...allMiddleware);
    });
};

module.exports = setupRoutes;
