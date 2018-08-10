const exchange = require('../../infraestrutura/mongo/models/exchanges.model')
const exchangeValidation = require('../exchange/exchange.validation')

// Método generico que irá tratar erros de banco de dados
const sendErrorsFromDB = (res, dbErrors) => {
  const errors = []
  _.forIn(dbErrors.errors, error => errors.push(error.message))
  return res.status(400).json({ errors })
}

// Método que retorna todas as exchange
const index = (req, res, next) => {
  // falta fazer para pegar por 1 exchange só
  exchange.find({}, function (err, query) {
    if (err) {
      return sendErrorsFromDB(res, err)
    } else {
      var exchanges = {}
      exchanges = query
      const dataExchanges = exchanges.map(function (e) {
        return { id_exchange: e.id, value: e.nome, label: e.nome }
      })

      res.status(200).json({
        data: dataExchanges,
        status: '200'
      })
    }
  })
}

/* Método que cria uma exchange
    @params : nome
*/
const post = (req, res, next) => {
  let ex = {
    nome: req.body.nome
  }

  const errors = exchangeValidation.validade_exchange(ex.nome)
  totalerros = Object.keys(errors).length

  for (i = 0; i < totalerros; i++) {
    if (errors) {
      res.status(400).json(errors)
    }
  }

  const nova_exchange = new exchange({
    nome: ex.nome
  })

  nova_exchange.save(err => {
    if (err) {
      res.status(400).json({
        message: 'Não foi possível cadastrar uma nova exchange',
        status: '400'
      })
    } else {
      res.status(201).json({
        message: 'Exchange cadastrada com sucesso',
        status: '201'
      })
    }
  })
}

/* Método que altera uma informação da exchange
    @params : nome, id
*/
const put = (req, res, next) => {
  id = req.query.id
  nome_novo = req.query.nome

  exchange.update({ _id: id }, { $set: { nome: nome_novo } }, function (err, query) {
    if (err) {
      return sendErrorsFromDB(res, err)
    } else {
      var exchanges = {}
      exchanges = query
      res.status(200).json({
        data: exchanges,
        message: 'Exchange alterada com sucesso',
        status: '200'
      })
    }
  })
}

/* Método que exclui uma exchange */
const exclusao = (req, res, next) => {
  res.send({ message: 'Não implementado ainda' })
}

module.exports = {
  index,
  post,
  put,
  exclusao
}
