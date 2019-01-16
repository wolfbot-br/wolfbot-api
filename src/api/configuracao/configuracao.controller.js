const configuracao = require('../../infraestrutura/mongo/models/configuracao.model')

// Método generico que irá tratar erros de banco de dados
const sendErrorsFromDB = (res, dbErrors) => {
  const errors = []
  _.forIn(dbErrors.errors, error => errors.push(error.message))
  return res.status(400).json({ errors })
}

// Método que retorna uma configuração salva no banco
const get = (req, res, next) => {
  const user_id = req.query.user_id

  configuracao.findOne({ 'user.user_id': user_id }, (err, configuracao) => {
    if (err) {
      return sendErrorsFromDB(res, err)
    } else {
      if (configuracao == null) {
        res.status(200).json({
          configuracao: {},
          message: 'Configuração não cadastrada!',
          status: '406'
        })
      } else {
        res.status(200).json({
          configuracao,
          message: 'Configuração recuperada com sucesso!',
          status: '200'
        })
      }
    }
  })
}

// Método que salva uma configuração no banco de dados
const post = (req, res, next) => {
  const json = JSON.stringify(req.body)
  const config = JSON.parse(json)

  const nova_configuracao = new configuracao({
    exchange: config.exchange,
    api_key: config.api_key,
    secret: config.secret,
    target_currency: config.target_currency,
    base_currency: config.base_currency,
    purchase_quantity: config.purchase_quantity,
    profit: config.profit,
    stop: config.stop,
    sellForIndicator: config.sellForIndicator,
    maxOrdersOpen: config.maxOrdersOpen,
    candle_size: config.candle_size,
    user: config.user,
    status: config.status,
    strategy: config.strategy
  })

  nova_configuracao.save(err => {
    if (err) {
      res.status(500).json({
        message: 'Não foi possível cadastrar uma nova configuração!',
        status: '500'
      })
    } else {
      res.status(201).json({
        message: 'Configuração cadastrada com sucesso!',
        status: '201'
      })
    }
  })
}

/* Método que retorna altera uma informação da exchange
    @params : nome, id
*/
const put = (req, res, next) => {
  res.send({ message: 'Não implementado ainda' })
}

/* Método que exclui uma exchange */
const exclusao = (req, res, next) => {
  res.send({ message: 'Não implementado ainda' })
}

module.exports = {
  get,
  post,
  put,
  exclusao
}
