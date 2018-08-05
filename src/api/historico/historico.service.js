const Historico = require('../../infraestrutura/mongo/models/historico.model');

const sendErrorsFromDB = (res, dbErrors) => {
    const errors = [];
    _.forIn(dbErrors.errors, error => errors.push(error.message));
    return res.status(400).json({ errors });
};

const historicos = (res, usuario) => {

    Historico.find({ usuario: usuario.email }, (err, historicos) => {
        if (err) {
            return sendErrorsFromDB(res, err);
        }
        return res.status(200).send({
            page: 1,
            limit: 10,
            total: historicos.length,
            data: historicos,
            errors: []
        });
    });
};

module.exports = {
    historicos
};