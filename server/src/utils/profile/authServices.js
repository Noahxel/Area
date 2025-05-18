exports.hasAuthService = (user, serviceName) =>
    user.externalAuth && user.externalAuth.some((service) => service.service === serviceName);
