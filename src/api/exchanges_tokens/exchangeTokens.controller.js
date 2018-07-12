const exchangeToken = require('../../infraestrutura/mongo/models/exchangesTokens.model');
const bcrypt = require('bcrypt');

// Método generico que irá tratar erros de banco de dados
const sendErrorsFromDB = (res, dbErrors) => {
    const errors = [];
    _.forIn(dbErrors.errors, error => errors.push(error.message));
    return res.status(400).json({ errors });
};

// Método que retorna todas as credencias
const index = (req, res, next) => {

    // const nome_exchange = req.query.nome;
    exchangeToken.find({}, function (err, query) {

        if (err) {
            return sendErrorsFromDB(res, err);
        } else {
            var exchanges = {}
            exchanges = query;

            res.status(200).json({
                data: exchanges,
                status: "200"
            });
        }
    });
}

/* Método que cria as credenciais no banco de dados
    @params : 	
            "key": "",
            "secret": "",
            "id_usuario": "",
            "nome_usuario": "",
            "id_exchange": "",
            "nome_exchange": ""
*/
const post = (req, res, next) => {

    // criptografando as credenciais
    // const salt = bcrypt.genSaltSync();

    let ex = {
        apiKey: req.body.key,
        secret: req.body.secret,
        usuario: { id_usuario: req.body.id_usuario, nome_usuario: req.body.nome_usuario },
        exchange: { id_exchange: req.body.id_exchange, nome_exchange: req.body.nome_exchange }
    };

    const nova_exchange = new exchangeToken({
        api_key: ex.apiKey,
        secret: ex.secret,
        usuario: ex.usuario,
        exchange: ex.exchange
    });

    nova_exchange.save(err => {
        if (err) {
            res.status(500).json({
                message: "Não foi possível cadastrar uma nova exchange",
                status: "500"
            });
        } else {
            res.status(201).json({
                data: ex,
                message: "Credenciais cadastradas com sucesso",
                status: "201"
            });
        }
    });
}

/* Método que retorna altera uma informação da exchange
    @params : nome, id
*/
const put = (req, res, next) => {
    res.send({ message: "Não implementado ainda" });
}

/* Método que exclui uma exchange */
const exclusao = (req, res, next) => {
    res.send({ message: 'Não implementado ainda' });
}

module.exports = {
    index,
    post,
    put,
    exclusao
};