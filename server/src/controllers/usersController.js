const User = require("../models/userModels");
const { Area } = require("../models/areaModels");

exports.deleteLoggedInUser = async (req, res) => {
    try {
        await Area.deleteMany({ userId: req.user.id });
        const { deletedCount: userDeletedCount } = await User.deleteOne({ _id: req.user.id });
        if (userDeletedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({ message: "User and associated areas deleted successfully" });
    } catch (error) {
        console.error("Error deleting user and areas:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.disconnectService = async (req, res) => {
    const { id: userId } = req.user;
    const { service_name: serviceName } = req.params;
    if (!serviceName) {
        return res.status(400).json({ message: "Service name not provided." });
    }
    try {
        const user = await User.findById(userId);
        if (!user.connectServices.has(serviceName)) {
            return res.status(400).json({ message: `User is not connected to ${serviceName}.` });
        }
        user.connectServices.delete(serviceName);
        await user.save();
        await Area.updateMany(
            {
                userId,
                $or: [{ "trigger.service": serviceName }, { "actions.service": serviceName }],
            },
            { isActive: false }
        );
        return res.json({
            message: `Successfully disconnected from ${serviceName} and related areas have been deactivated.`,
        });
    } catch (error) {
        console.error("Error disconnecting the service:", error);
        return res.status(500).json({ message: "Error disconnecting the service." });
    }
};
