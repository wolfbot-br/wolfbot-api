const ccxt = require('ccxt')
const moment = require('moment')
const strategy = require('./bot.strategies')

function roboLigado(status) {
    this.status = status
    if (this.status) {
        const configuracao = {
            exchange: 'bittrex',
            parMoedas: 'BTC/USDT',
            quantidadePeriodos: 10,
            tamanhoCandle: '5m',
            estrategia: {
                sinalExterno: {},
                indicadores: {
                    sma: {
                        nome: 'sma',
                        status: true,
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
                        status: true,
                        period: 5
                    }
                }
            },
            intervaloMonitoramento: 10000
        }
        acionarMonitoramento(configuracao)
    }
}

function acionarMonitoramento(configuracao) {
    exchangeCCXT = new ccxt[configuracao.exchange]()
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
    setInterval(
        async function load() {
            await sleep(exchangeCCXT.rateLimit) // milliseconds
            const candle = await exchangeCCXT.fetchOHLCV(configuracao.parMoedas, configuracao.tamanhoCandle, since = tempo.valueOf(), limit = 1000)

            strategy.loadStrategy(config = configuracao.estrategia.indicadores, candle)

        }, configuracao.intervaloMonitoramento
    )
}

module.exports = { roboLigado }

