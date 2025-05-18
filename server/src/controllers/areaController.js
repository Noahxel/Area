const User = require("../models/userModels");
const { createNewArea } = require("../utils/area/areaCreation");
const { checkParameters } = require("../utils/area/parameters/checkParams");
const { generateDescription } = require("../utils/area/generateDescription");
const { doesDuplicateActionExist, isExistingArea } = require("../utils/area/areaValidation");
const { getAllAreas, getArea, deleteArea, updateAreaActivation } = require("../utils/area/areaDb");

exports.listAllAreas = async (req, res) => {
    try {
        const areas = await getAllAreas(req.user.id);
        res.status(200).json(areas);
    } catch (error) {
        res.status(500).json({ message: "Error fetching areas", error });
    }
};

exports.switchAreaActivationStatus = async (req, res) => {
    try {
        const result = await updateAreaActivation(req.params.id);
        if (result) {
            res.status(200).json(result);
        } else {
            return res.status(404).json({ message: "Area not found." });
        }
    } catch (error) {
        console.error("Error toggling area activation status:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.createArea = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        console.log(`Received area creation request: ${JSON.stringify(req.body)}`);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        if (doesDuplicateActionExist(req.body.actions)) {
            return res.status(400).json({ message: "Duplicate actions provided." });
        }
        if (await isExistingArea(user, req.body.trigger, req.body.actions)) {
            return res.status(400).json({ message: "An area with the same trigger and actions already exists." });
        }
        await checkParameters(req.user.id, req.body.trigger, req.body.actions);
        const areaDescription = await generateDescription(req.body);
        const savedArea = await createNewArea(user, req.body.trigger, req.body.actions, areaDescription);
        res.status(200).json(savedArea);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAreaById = async (req, res) => {
    try {
        const area = await getArea(req.params.id);
        if (area) {
            res.status(200).json(area);
        } else {
            res.status(404).json({ message: "Area not found for the given ID" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching the area", error });
    }
};

exports.deleteAreaById = async (req, res) => {
    try {
        const result = await deleteArea(req.params.id);
        if (result) {
            res.status(200).json({ message: "Area deleted successfully" });
        } else {
            res.status(404).json({ message: "Area not found for the given ID" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting the area", error });
    }
};
