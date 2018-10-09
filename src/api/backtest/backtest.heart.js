const ccxt = require('ccxt')
const moment = require('moment')
const configuracao = require('../../infraestrutura/mongo/models/backtest.configuracao.model')
const strategy = require('./backtest.strategies')

async function carregarDados(params) {
  exchangeCCXT = new ccxt[params.exchange]()
  await exchangeCCXT.loadMarkets()

  const pair_currency = `${params.target_currency}/${params.base_currency}`
  const market = exchangeCCXT.markets[pair_currency]
  const candle_size = params.candle_size
  const configIndicators = params.indicator

  let time = params.date_timestamp

  const candle = await exchangeCCXT.fetchOHLCV(pair_currency, candle_size, time)
  const result = await strategy.loadStrategy(configIndicators, candle, market)

  return {
    candle: candle,
    result: result
  }
}

module.exports = { carregarDados }
