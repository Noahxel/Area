const routes = [
    { path: "/auth", router: "./authRoutes" },
    { path: "/reset", router: "./resetRoutes" },
    {
        path: "/profile",
        router: "./profileRoutes",
        middlewares: ["../middleware/general/authenticationMiddleware"],
    },
    {
        path: "/users",
        router: "./usersRoutes",
        middlewares: ["../middleware/general/authenticationMiddleware"],
    },
    { path: "/connect", router: "./connectRoutes" },
    {
        path: "/areas",
        router: "./areaRoutes",
        middlewares: ["../middleware/general/authenticationMiddleware"],
    },
    { path: "/about.json", router: "./aboutRoutes" },
    {
        path: "/api-docs",
        router: "swagger-ui-express",
        handler: "swagger-ui-express",
        handlerConfig: "../config/swaggerConfig",
    },
];

module.exports = routes;
