const ccxt = require('ccxt')
const moment = require('moment')
const robo = require('set-interval')
const strategy = require('./bot.strategies')
const configuracao = require('../../infraestrutura/mongo/models/configuracao.model')

async function roboLigado(params) {

    const config = await configuracao.findOne({ 'usuario.id_usuario': params.id_usuario })

    // const configuracao = {
    //     exchange: 'bittrex',
    //     parMoedas: 'BTC/USDT',
    //     quantidadePeriodos: 10,
    //     tamanhoCandle: '5m',
    //     estrategia: {
    //         sinalExterno: {},
    //         indicadores: {
    //             sma: {
    //                 nome: 'sma',
    //                 status: true,
    //                 period: 3
    //             },
    //             macd: {
    //                 nome: 'macd',
    //                 status: true,
    //                 shortPeriod: 2,
    //                 longPeriod: 5,
    //                 signalPeriod: 9
    //             },
    //             rsi: {
    //                 nome: 'rsi',
    //                 status: true,
    //                 period: 5
    //             }
    //         }
    //     },
    //     intervaloMonitoramento: 10000,
    //     chave: params.chave
    // }
    acionarMonitoramento(config)
}

function roboDesligado(params) {

    const config = await configuracao.findOne({ 'usuario.id_usuario': params.id_usuario })
    // const configuracao = {
    //     exchange: 'bittrex',
    //     parMoedas: 'BTC/USDT',
    //     quantidadePeriodos: 10,
    //     tamanhoCandle: '5m',
    //     estrategia: {
    //         sinalExterno: {},
    //         indicadores: {
    //             sma: {
    //                 nome: 'sma',
    //                 status: true,
    //                 period: 3
    //             },
    //             macd: {
    //                 nome: 'macd',
    //                 status: true,
    //                 shortPeriod: 2,
    //                 longPeriod: 5,
    //                 signalPeriod: 9
    //             },
    //             rsi: {
    //                 nome: 'rsi',
    //                 status: true,
    //                 period: 5
    //             }
    //         }
    //     },
    //     intervaloMonitoramento: 10000,
    //     chave: params.chave
    // }
    robo.clear(config.chave)
}

function acionarMonitoramento(configuracao) {

    let nome_exchange = configuracao.exchange.nome_exchange.toLowerCase()
    exchangeCCXT = new ccxt[nome_exchange]()

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

            strategy.loadStrategy(config = configuracao.estrategia.indicadores, candle)

        }, configuracao.intervaloMonitoramento, configuracao.chave
    )
}

module.exports = { roboLigado, roboDesligado }

