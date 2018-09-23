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
  let ex = {
    exchange: req.body.exchange || '',
    apiKey: req.body.api_key || '',
    secret: req.body.secret || '',
    user: {
      user_name: req.body.user.user_name || '',
      user_id: req.body.user.user_id || ''
    },
    status: {
      status_bot: req.body.status.status_bot || false,
      status_buy: req.body.status.status_buy || false,
      status_sell: req.body.status.status_sell || false,
      key: req.body.status.key || '',
      interval_check: req.body.status.interval_check || 30000
    },
    base_currency: req.body.base_currency || '',
    target_currency: req.body.target_currency || '',
    candle_size: req.body.candle_size || '30m',
    strategy: {
      external_signal: {},
      indicators: {
        sma: {
          status: req.body.strategy.indicators.sma.status || false,
          period: req.body.strategy.indicators.sma.period || 9
        },
        macd: {
          status: req.body.strategy.indicators.macd.status || false,
          shortPeriod: req.body.strategy.indicators.macd.shortPeriod || 12,
          longPeriod: req.body.strategy.indicators.macd.longPeriod || 26,
          signalPeriod: req.body.strategy.indicators.macd.signalPeriod || 9
        },
        rsi: {
          status: req.body.strategy.indicators.rsi.status || false,
          period: req.body.strategy.indicators.sma.period || 9
        }
      }
    }
  }

  const nova_configuracao = new configuracao({
    exchange: ex.exchange,
    api_key: ex.apiKey,
    secret: ex.secret,
    user: ex.user,
    status: ex.status,
    base_currency: ex.base_currency,
    target_currency: ex.target_currency,
    candle_size: ex.candle_size,
    strategy: ex.strategy
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
