const { Area } = require("../../models/areaModels");

exports.createNewArea = async (user, trigger, actions, areaDescription) => {
    const newArea = new Area({
        userId: user._id,
        trigger: {
            service: trigger.service,
            name: trigger.name,
            parameters: trigger.parameters,
        },
        actions: actions.map((a) => ({
            service: a.service,
            name: a.name,
            parameters: a.parameters,
        })),
        isActive: true,
        area_description: areaDescription,
    });
    return await newArea.save();
};
