const ccxt = require('ccxt')
const moment = require('moment')
const robo = require('set-interval')
const strategy = require('./bot.strategies')
const configuracao = require('../../infraestrutura/mongo/models/configuracao.model')
const chalk = require('chalk')

async function roboLigado(params) {
    const config = await configuracao.findOne({ 'user.user_id': params.user_id })

    console.log(chalk.green('########## Robo Ligado ##########'))
    acionarMonitoramento(config)
}

async function roboDesligado(params) {

    const config = await configuracao.findOne({ 'usuario.id_usuario': params.id_usuario })

    console.log(chalk.red('########## Robo Desligado ##########'))
    robo.clear(config.status_bot.key)
}

function acionarMonitoramento(config) {

    let nome_exchange = config.exchange.toLowerCase()
    exchangeCCXT = new ccxt[nome_exchange]()

    let periodo = ''
    const unidadeTempo = config.candle_size.substr(-1)
    const unidadeTamanho = Number.parseInt(config.candle_size.substr(0))
    const parMoedas = `${config.target_currency}/${config.base_currency}`
    const tamanhoCandle = config.candle_size
    const configIndicators = config.strategy.indicators

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
            const candle = await exchangeCCXT.fetchOHLCV(parMoedas, tamanhoCandle, since = tempo.valueOf(), limit = 1000)

            strategy.loadStrategy(configIndicators, candle)

        }, config.status.interval_check, config.status.key
    )
}

module.exports = { roboLigado, roboDesligado }

