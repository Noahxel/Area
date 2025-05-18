const User = require("../../models/userModels");

exports.findUserByExternalId = async function (service, serviceEmail) {
    return User.findOne({
        "externalAuth.service": service,
        email: serviceEmail,
    });
};

exports.createNewExternalUser = async function (service, email, serviceId = null) {
    const usernameFromEmail = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");

    const newUser = new User({
        username: usernameFromEmail,
        email: email,
        confirmed: true,
        externalAuth: [
            {
                service: service,
                serviceId: serviceId,
            },
        ],
    });
    await newUser.save();
    return newUser;
};
