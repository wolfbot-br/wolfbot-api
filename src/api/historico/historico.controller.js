const env = require('../../../.env');
const jwt = require('jsonwebtoken');

const historicoService = require('../historico/historico.service');

const historicos = (req, res, next) => {
    const token = req.headers['authorization'];
    jwt.verify(token, env.authSecret, function (err, decoded) {
        historicoService.historicos(res, decoded._doc);
    });
};

module.exports =
    {
        historicos
    };  