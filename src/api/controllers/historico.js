const service = require("../services/historico.service");

const historicos = (req, res, next) => {
    service.historicos(res, req.user);
};

module.exports = {
    historicos,
};
