function logRequestInfo(req, res, next) {
    console.log("----- Incoming Request -----");
    console.log("Time:", new Date().toISOString());
    console.log("Method:", req.method);
    console.log("URL:", req.originalUrl);
    console.log("Headers:", JSON.stringify(req.headers, null, 2));

    if (req.body && Object.keys(req.body).length) {
        console.log("Body:", JSON.stringify(req.body, null, 2));
    }
    next();
}

module.exports = logRequestInfo;
