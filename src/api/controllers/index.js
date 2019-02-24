import config from "../config";

const index = (req, res, next) =>
    res.status(200).json({
        application: "Wolfbot API",
        environment: config.environment,
    });

export default { index };
