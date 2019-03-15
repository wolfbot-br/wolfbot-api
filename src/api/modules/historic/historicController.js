const service = require("./historicService");

const historicos = (req, res, next) => {
    service.historicos(res, req.user);
};

module.exports = {
    historicos,
};
