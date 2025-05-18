const { AREAS } = require("../core/areaServices");
const { formatService } = require("../utils/about/serviceFormatters");

exports.getInfo = (req, res) => {
    try {
        const services = Object.keys(AREAS)
            .map((areaKey) => formatService(areaKey, AREAS[areaKey]))
            .filter(Boolean);

        res.status(200).json({
            client: {
                host: req.ip,
            },
            server: {
                current_time: Math.floor(Date.now() / 1000),
                services,
            },
        });
    } catch (error) {
        console.error("Error fetching about data:", error);
        res.status(500).json({ message: "Server error." });
    }
};
