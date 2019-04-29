const _ = require("lodash");

const Configuration = require("../../models/configurationModel");

// Método generico que irá tratar erros de banco de dados
const sendErrorsFromDB = (res, dbErrors) => {
    const errors = [];
    _.forIn(dbErrors.errors, (error) => errors.push(error.message));
    return res.status(400).json({ errors });
};

// Método que retorna uma configuração salva no banco
const get = (req, res) => {
    const { uid } = req.user;
    Configuration.findOne({ user_uid: uid }, (err, configuracao) => {
        if (err) {
            return sendErrorsFromDB(res, err);
        }
        if (configuracao == null) {
            res.status(404).json({
                configuracao: {},
                message: "Configuração não cadastrada!",
            });
        }
        return res.status(200).json({
            configuracao,
            message: "Configuração recuperada com sucesso!",
        });
    });
};

// Método que salva uma configuração no banco de dados
const post = (req, res) => {
    const { uid } = req.user;
    const values = req.body;
    const query = { user_uid: uid };
    const options = { upsert: true, new: true };
    Configuration.findOneAndUpdate(query, values, options, (err, configuracao) => {
        if (err) {
            return res.status(400).json({
                erro: err.message,
            });
        }
        return res.status(200).json({
            configuracao,
            message: "Configuração gravada com sucesso!",
        });
    });
};

module.exports = {
    get,
    post,
};
