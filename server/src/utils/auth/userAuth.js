const bcrypt = require("bcryptjs");
const User = require("../../models/userModels");

exports.verifyUserPassword = async function (email, password) {
    const user = await User.findOne({ email });
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
};
