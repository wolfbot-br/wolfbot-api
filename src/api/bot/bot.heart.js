const ccxt = require('ccxt')
const moment = require('moment')
const lodash = require('lodash')
const tulind = require('tulind')
const robo = require('set-interval')

function roboLigado(params) {

    const configuracao = {
        exchange: 'bittrex',
        parMoedas: 'BTC/USDT',
        quantidadePeriodos: 10,
        tamanhoCandle: '5m',
        intervaloMonitoramento: 10000,
        chave: params.chave
    }

    acionarMonitoramento(configuracao)
}

function roboDesligado(params) {

    const configuracao = {
        exchange: 'bittrex',
        parMoedas: 'BTC/USDT',
        quantidadePeriodos: 10,
        tamanhoCandle: '5m',
        intervaloMonitoramento: 10000,
        chave: params.chave
    }

    robo.clear(configuracao.chave)
}

function acionarMonitoramento(configuracao) {

    exchangeCCXT = new ccxt[configuracao.exchange]()
    const index = 4 // [ timestamp, open, high, low, close, volume ]
    let periodo = ''
    const unidadeTempo = configuracao.tamanhoCandle.substr(-1)
    const unidadeTamanho = Number.parseInt(configuracao.tamanhoCandle.substr(0))

    if (unidadeTempo === 'm') {
        periodo = 'minutes'
    } else if (unidadeTempo === 'h') {
        periodo = 'hours'
    } else {
        periodo = 'days'
    }

    const tempo = moment().subtract(configuracao.quantidadePeriodos * unidadeTamanho, periodo)
    let sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    robo.start(
        async function load() {
            await sleep(exchangeCCXT.rateLimit) // milliseconds
            const candle = await exchangeCCXT.fetchOHLCV(configuracao.parMoedas, configuracao.tamanhoCandle, since = tempo.valueOf(), limit = 1000)
            const candleTime = candle[candle.length - 5][index] // timestamp
            const lastPrice = candle[candle.length - 1][index] // preço de fechamento
            const close = lodash.flatten(candle.map(function (value) {
                return value.filter(function (value2, index2) {
                    if (index2 === 4) {
                        return value2
                    }
                })
            }))

            tulind.indicators.sma.indicator([close], [3], function (err, results) {
                console.log('Resultado é:' + results[0])
            })

        }, configuracao.intervaloMonitoramento, configuracao.chave
    )
}

module.exports = { roboLigado, roboDesligado }

