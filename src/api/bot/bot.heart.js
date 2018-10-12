const ccxt = require('ccxt')
const moment = require('moment')
const robo = require('set-interval')
const strategy = require('./bot.strategies')
const configuracao = require('../../infraestrutura/mongo/models/configuracao.model')
const _ = require('lodash')

async function roboLigado(params) {
  const config = await configuracao.findOne({ 'user.user_id': params.user_id })

  console.log('########## Robo Ligado ##########')
  acionarMonitoramento(config)
}

function roboDesligado(params) {
  console.log('########## Robo Desligado ##########')
  robo.clear(params.key)
}

async function acionarMonitoramento(config) {

  let nome_exchange = config.exchange.toLowerCase()
  exchangeCCXT = new ccxt[nome_exchange]()

  exchangeCCXT.apiKey = config.api_key
  exchangeCCXT.secret = config.secret

  const saldo = await exchangeCCXT.fetchBalance()
  let periodo = ''
  const unidadeTempo = config.candle_size.substr(-1)
  const unidadeTamanho = Number.parseInt(config.candle_size.substr(0))
  const tamanhoCandle = config.candle_size
  const configIndicators = config.strategy.indicators
  const moedaBase = saldo.USDT.free

  if (unidadeTempo === 'm') {
    periodo = 'minutes'
  } else if (unidadeTempo === 'h') {
    periodo = 'hours'
  } else {
    periodo = 'days'
  }

  const tempo = moment().subtract(100 * unidadeTamanho, periodo)
  let sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
  robo.start(
    async function load() {
      await sleep(exchangeCCXT.rateLimit) // milliseconds
      _.flatten(config.target_currency.map(function (reuslt, key) {
        _.forEach([reuslt], async function (value) {
          const parMoedas = value.currency + "/" + value.base_currency
          const amount = value.amount
          const candle = await exchangeCCXT.fetchOHLCV(parMoedas, tamanhoCandle, since = tempo.valueOf(), limit = 1000)
          await strategy.loadStrategy(configIndicators, candle, moedaBase, parMoedas, amount)
        })
      }))
    }, config.status.interval_check, config.status.key
  )
}

module.exports = { roboLigado, roboDesligado }

//VOU USAR ISSO PRA VÁRIAS MOEDAS

// await exchangeCCXT.loadMarkets()

//   let sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
//   if (exchangeCCXT.has.fetchOHLCV) {
//     for (let i = 0; i <= markets.length - 1; i++) {
//       await sleep(exchangeCCXT.rateLimit) // milliseconds
//       candle[i] = await exchangeCCXT.fetchOHLCV(markets[i], tamanhoCandle, tempo)
//       result[i] = await strategy.loadStrategy(configIndicators, candle)
//     }
//   }
//   return {
//     candle: candle,
//     result: result
//   }
// }
