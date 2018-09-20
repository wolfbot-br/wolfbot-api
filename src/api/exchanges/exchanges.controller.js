const ccxt = require('ccxt')
const configuracao = require('../../infraestrutura/mongo/models/configuracao.model')
const exchangeValidation = require('../exchanges/exchanges.validation')
const utilService = require('../util/util.service')

// # PUBLIC METHODS /

// Método que retorna todas as exchanges que bot trabalha
const loadExchanges = (req, res, next) => {
  const exchanges = ccxt.exchanges
  const dataExchanges = exchanges.map(function (e) {
    return { value: e, label: e }
  })

  res.status(200).json({
    data: dataExchanges,
    status: '200'
  })
}

const structure = async (req, res, next) => {
  try {
    params = {
      exchange: req.query.exchange
    }

    let exchange = utilService.selecionarExchange(params.exchange)
    res.status(200).json({
      'data': exchange
    })
  } catch (e) {
    res.status(400).json({
      'message': e.message,
      'status': '400'
    })
  }
}

const currencies = async (req, res, next) => {
  try {
    params = {
      exchange: req.query.exchange
    }

    let exchange = utilService.selecionarExchange(params.exchange)
    let currencies = await exchange.fetchCurrencies()
    res.status(200).json({
      'data': currencies
    })
  } catch (e) {
    res.status(400).json({
      'message': e.message,
      'status': '400'
    })
  }
}

const loadMarkets = async (req, res, next) => {
  try {
    params = {
      exchange: req.query.exchange
    }

    let exchange = utilService.selecionarExchange(params.exchange)
    let markets = await exchange.loadMarkets(true)
    res.status(200).json({
      'data': markets
    })
  } catch (e) {
    res.status(400).json({
      'message': e.message,
      'status': '400'
    })
  }
}

// Retorna todos aos tipos de cryptomoedas que a exchange trabalha
const symbols = async (req, res, next) => {
  try {
    params = {
      exchange: req.query.exchange
    }

    let exchange = utilService.selecionarExchange(params.exchange)
    let markets = await exchange.loadMarkets(true)
    let symbols = exchange.symbols

    res.status(200).json({
      'data': symbols
    })
  } catch (e) {
    res.status(400).json({
      'message': e.message,
      'status': '400'
    })
  }
}

const getMarketStructureBySimbol = async (req, res, next) => {
  try {
    params = {
      exchange: req.query.exchange
    }

    let exchange = utilService.selecionarExchange(params.exchange)
    let Base = req.headers.base || ''
    let Quote = req.headers.quote || ''
    let markets = await exchange.loadMarkets(true)

    symbol = `${Base}/${Quote}`

    let marketsStructure = exchange.market(symbol)

    res.status(200).json({
      'data': marketsStructure
    })
  } catch (e) {
    res.status(400).json({
      'message': e.message,
      'status': '400'
    })
  }
}

const getMarketIdBySimbol = async (req, res, next) => {
  try {
    params = {
      exchange: req.query.exchange
    }

    let exchange = utilService.selecionarExchange(params.exchange)
    let Base = req.headers.base || ''
    let Quote = req.headers.quote || ''
    let markets = await exchange.loadMarkets(true)

    marketSymbol = `${Base}/${Quote}`

    let marketsId = exchange.marketId(marketSymbol)

    res.status(200).json({
      'data': marketsId
    })
  } catch (e) {
    res.status(400).json({
      'message': e.message,
      'status': '400'
    })
  }
}

const fetchOrderBookBySymbol = async (req, res, next) => {
  try {
    params = {
      exchange: req.query.exchange
    }

    let exchange = utilService.selecionarExchange(params.exchange)
    let Base = req.headers.base || ''
    let Quote = req.headers.quote || ''

    marketSymbol = `${Base}/${Quote}`

    let orderBook = await exchange.fetchOrderBook(marketSymbol)

    res.status(200).json({
      'data': orderBook
    })
  } catch (e) {
    res.status(400).json({
      'message': e.message,
      'status': '400'
    })
  }
}

// Busca todos os tickes
const fetchTickers = async (req, res, next) => {
  try {
    params = {
      exchange: req.query.exchange
    }

    let exchange = utilService.selecionarExchange(params.exchange)
    let tickers = await exchange.fetchTickers()
    res.status(200).json({
      'data': tickers
    })
  } catch (e) {
    res.status(400).json({
      'message': e.message,
      'status': '400'
    })
  }
}

// Busca um ticker específico
const fetchTicker = async (req, res, next) => {
  try {
    params = {
      exchange: req.query.exchange,
      symbol: req.query.symbol
    }

    if (!params.symbol) {
      res.status(400).json({
        msg: 'Simbolo incorreto',
        status: '500'
      })
    }

    let exchange = utilService.selecionarExchange(params.exchange)
    let ticker = await exchange.fetchTicker(params.symbol)

    res.status(200).json({
      'data': ticker
    })
  } catch (e) {
    res.status(400).json({
      'message': e.message,
      'status': '400'
    })
  }
}

// # PRIVATE METHODS /

const fetchBalance = async (req, res, next) => {
  try {
    params = {
      id_usuario: req.query.id_usuario,
      exchange: 'bittrex' // LEMBRETE...HACK PARA FUNCIONAR VIDEO DO DIA 21/08
    }

    let exchange = utilService.selecionarExchange(params.exchange)
    exchangeValidation.validarDados(params)

    // Um dos melhores jeitos de fazer um select
    const credenciais = await configuracao
      .findOne({ 'usuario.id_usuario': params.id_usuario })

    exchangeValidation.validarRequisitosExchange(credenciais)

    exchange.apiKey = credenciais.api_key
    exchange.secret = credenciais.secret

    let saldo = await exchange.fetchBalance()
    res.status(200).json({
      'data': saldo
    })
  } catch (e) {
    res.status(400).json({
      'message': e.message,
      'status': '400'
    })
  }
}

const orderBuy = async (req, res, next) => {
  try {
    if (!req.body.simbolo) {
      throw new Error('Informe o simbolo')
    }

    params = {
      id_usuario: req.body.id_usuario,
      id_exchange: req.body.id_exchange,
      tipo: req.body.tipo,
      simbolo: req.body.simbolo.toUpperCase(),
      montante: req.body.montante,
      preco: req.body.preco,
      exchange: req.body.exchange
    }

    let exchange = utilService.selecionarExchange(params.exchange)
    exchangeValidation.validarDados(params)

    // Um dos melhores jeitos de fazer um select
    const credenciais = await configuracao
      .findOne({ 'usuario.id_usuario': params.id_usuario })
      .where({ 'exchange.id_exchange': params.id_exchange })

    exchangeValidation.validarRequisitosExchange(credenciais)

    exchange.apiKey = credenciais.api_key
    exchange.secret = credenciais.secret

    order = await exchange.createLimitBuyOrder(
      params.simbolo, // Simbolo da cryptomoeda BTC/USDT
      params.montante, // Montante
      params.preco, // Preço de venda
      { ' tipo ': params.tipo } // tipo: limite ou mercado
    )

    res.status(200).json({
      'data': order,
      'message': 'Ordem de compra realizada com sucesso.',
      'status': 200
    })
  } catch (e) {
    res.status(400).json({
      'message': e.message,
      'status': '400'
    })
  }
}

const orderSell = async (req, res, next) => {
  try {
    if (!req.body.simbolo) {
      throw new Error('Informe o simbolo')
    }

    params = {
      id_usuario: req.body.id_usuario,
      id_exchange: req.body.id_exchange,
      tipo: req.body.tipo,
      simbolo: req.body.simbolo.toUpperCase(),
      montante: req.body.montante,
      preco: req.body.preco,
      exchange: req.body.exchange
    }

    let exchange = utilService.selecionarExchange(params.exchange)
    exchangeValidation.validarDados(params)

    // Um dos melhores jeitos de fazer um select
    const credenciais = await configuracao
      .findOne({ 'usuario.id_usuario': params.id_usuario })
      .where({ 'exchange.id_exchange': params.id_exchange })

    exchangeValidation.validarRequisitosExchange(credenciais)

    exchange.apiKey = credenciais.api_key
    exchange.secret = credenciais.secret

    order = await exchange.createLimitSellOrder(
      params.simbolo, // Simbolo da cryptomoeda BTC/USDT
      params.montante, // Montante
      params.preco, // Preço de venda
      { ' tipo ': params.tipo } // tipo: limite ou mercado
    )

    res.status(200).json({
      'data': order,
      'message': 'Ordem de venda realizada com sucesso..',
      'status': 200
    })
  } catch (e) {
    res.status(400).json({
      'message': e.message,
      'status': '400'
    })
  }
}

const openOrders = async (req, res, next) => {
  try {
    if (!req.query.simbolo) {
      throw new Error('Informe o simbolo')
    }

    params = {
      id_usuario: req.query.id_usuario,
      id_exchange: req.query.id_exchange,
      simbolo: req.query.simbolo.toUpperCase(),
      tempo: req.query.tempo,
      limite: req.query.limite,
      exchange: req.query.exchange
    }

    let exchange = utilService.selecionarExchange(params.exchange)
    exchangeValidation.validarDados(params)

    // Um dos melhores jeitos de fazer um select
    const credenciais = await configuracao
      .findOne({ 'usuario.id_usuario': params.id_usuario })
      .where({ 'exchange.id_exchange': params.id_exchange })

    exchangeValidation.validarRequisitosExchange(credenciais)

    exchange.apiKey = credenciais.api_key
    exchange.secret = credenciais.secret

    ordens = await exchange.fetchOpenOrders(
      symbol = params.simbolo,
      since = params.tempo,
      limit = params.limite,
      params = {}
    )

    res.status(200).json({
      'data': ordens,
      'status': 200
    })
  } catch (e) {
    res.status(400).json({
      'message': e.message,
      'status': '400'
    })
  }
}

module.exports = {
  loadExchanges,
  loadMarkets,
  getMarketStructureBySimbol,
  getMarketIdBySimbol,
  symbols,
  currencies,
  structure,
  fetchOrderBookBySymbol,
  fetchTickers,
  fetchTicker,
  fetchBalance,
  orderBuy,
  orderSell,
  openOrders
}
