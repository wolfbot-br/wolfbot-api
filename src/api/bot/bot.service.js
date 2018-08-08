const configuracao = require('../../infraestrutura/mongo/models/exchangesTokens.model')

// Método generico que irá tratar erros de banco de dados
const sendErrorsFromDB = (res, dbErrors) => {
    const errors = [];
    _.forIn(dbErrors.errors, error => errors.push(error.message));
    return res.status(400).json({ errors });
};

const stop = (play, params) => {

    clearInterval(play);
    configuracao.update(
        { "usuario.id_usuario": params.id_usuario, "exchange.id_exchange": params.id_exchange },
        { $set: { status: "offline" } },
        function (err, query) {
            if (err) {
                return sendErrorsFromDB(res, err);
            } else {
                console.log('Configuração alterado com sucesso1.')
            }
        });

    return
}

const play = (params) => {

    configuracao.update(
        { "usuario.id_usuario": params.id_usuario, "exchange.id_exchange": params.id_exchange },
        { $set: { status: "online" } },
        function (err, query) {
            if (err) {
                return sendErrorsFromDB(res, err);
            } else {
                console.log('Configuração alterado com sucesso2.')
            }
        });

    return
}

module.exports = {
    stop,
    play
}