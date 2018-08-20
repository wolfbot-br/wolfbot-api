const ccxt = require('ccxt')
const moment = require('moment')
const robo = require('set-interval')
const strategy = require('./bot.strategies')

function roboLigado(params) {

    const configuracao = {
        exchange: 'bittrex',
        parMoedas: 'BTC/USDT',
        quantidadePeriodos: 50,
        tamanhoCandle: '5m',
        estrategia: {
            sinalExterno: {},
            indicadores: {
                sma: {
                    nome: 'sma',
                    status: false,
                    period: 3
                },
                macd: {
                    nome: 'macd',
                    status: true,
                    shortPeriod: 2,
                    longPeriod: 5,
                    signalPeriod: 9
                },
                rsi: {
                    nome: 'rsi',
                    status: false,
                    period: 5
                }
            }
        },
        intervaloMonitoramento: 60000,
        chave: params.chave
    }
    acionarMonitoramento(configuracao)
}

function roboDesligado(params) {

    const configuracao = {
        exchange: 'bittrex',
        parMoedas: 'BTC/USDT',
        quantidadePeriodos: 50,
        tamanhoCandle: '5m',
        estrategia: {
            sinalExterno: {},
            indicadores: {
                sma: {
                    nome: 'sma',
                    status: false,
                    period: 3
                },
                macd: {
                    nome: 'macd',
                    status: true,
                    shortPeriod: 12,
                    longPeriod: 26,
                    signalPeriod: 9
                },
                rsi: {
                    nome: 'rsi',
                    status: false,
                    period: 5
                }
            }
        },
        intervaloMonitoramento: 60000,
        chave: params.chave
    }
    robo.clear(configuracao.chave)
}

function acionarMonitoramento(configuracao) {

    exchangeCCXT = new ccxt[configuracao.exchange]()
    let periodo = ''
    const unidadeTempo = configuracao.tamanhoCandle.substr(-1)
    const unidadeTamanho = Number.parseInt(configuracao.tamanhoCandle.substr(0))
    const parMoedas = configuracao.parMoedas
    const tamanhoCandle = configuracao.tamanhoCandle

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
            const candle = await exchangeCCXT.fetchOHLCV(parMoedas, tamanhoCandle, since = tempo.valueOf(), limit = 1000)

            await strategy.loadStrategy(config = configuracao.estrategia.indicadores, candle)

        }, configuracao.intervaloMonitoramento, configuracao.chave
    )
}

module.exports = { roboLigado, roboDesligado }

