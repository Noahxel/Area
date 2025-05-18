const { Area } = require("../../models/areaModels");

exports.getAllAreas = async (userId) => {
    return await Area.find({ userId }).select("-userId");
};

exports.getArea = async (id) => {
    return await Area.findById(id);
};

exports.deleteArea = async (id) => {
    return await Area.findByIdAndDelete(id);
};

exports.updateAreaActivation = async (id) => {
    const area = await Area.findById(id);
    area.isActive = !area.isActive;
    await area.save();
    return area;
};
