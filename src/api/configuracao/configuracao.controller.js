const configuracao = require('../../infraestrutura/mongo/models/configuracao.model')

// Método generico que irá tratar erros de banco de dados
const sendErrorsFromDB = (res, dbErrors) => {
  const errors = []
  _.forIn(dbErrors.errors, error => errors.push(error.message))
  return res.status(400).json({ errors })
}

// Método que retorna uma credencial
const index = (req, res, next) => {
  const usuario = req.query.id_usuario

  configuracao.findOne({ 'usuario.id_usuario': usuario }, { api_key: 0, secret: 0 }, (err, query) => {
    if (err) {
      return sendErrorsFromDB(res, err)
    } else {
      if (query == null) {
        res.status(200).json({
          id_exchange: '',
          nome_exchange: '',
          status: '406'
        })
      } else {
        res.status(200).json({
          id_exchange: query.exchange.id_exchange,
          nome_exchange: query.exchange.nome_exchange,
          status: '200'
        })
      }
    }
  })
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
  let ex = {
    apiKey: req.body.key || '',
    secret: req.body.secret || '',
    usuario: {
      id_usuario: req.body.id_usuario || '',
      nome_usuario: req.body.nome_usuario || ''
    },
    exchange: {
      id_exchange: req.body.id_exchange || '',
      nome_exchange: req.body.nome_exchange || ''
    },
    estrategia: {
      sinalExterno: {},
      indicadores: {
        sma: {
          nome: req.body.estrategia.indicadores.sma.nome || '',
          status: req.body.estrategia.indicadores.sma.status || '',
          period: req.body.estrategia.indicadores.sma.period || ''
        },
        macd: {
          nome: req.body.estrategia.indicadores.macd.nome || '',
          status: req.body.estrategia.indicadores.macd.status || '',
          period: req.body.estrategia.indicadores.macd.period || ''
        },
        rsi: {
          nome: req.body.estrategia.indicadores.rsi.nome || '',
          status: req.body.estrategia.indicadores.rsi.status || '',
          period: req.body.estrategia.indicadores.rsi.period || ''
        }
      }
    },
    status: req.body.status || '',
    chave: req.body.chave || ''
  }

  const nova_exchange = new configuracao({
    api_key: ex.apiKey,
    secret: ex.secret,
    usuario: ex.usuario,
    exchange: ex.exchange,
    status: ex.status,
    chave: ex.chave,
    estrategia: ex.estrategia
  })

  nova_exchange.save(err => {
    if (err) {
      res.status(500).json({
        message: 'Não foi possível cadastrar uma nova exchange',
        status: '500'
      })
    } else {
      res.status(201).json({
        data: ex,
        message: 'Credenciais cadastradas com sucesso',
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
  index,
  post,
  put,
  exclusao
}
