const lodash = require('lodash')
const tulind = require('tulind')
const moment = require('moment')
const chalk = require('chalk')

function loadStrategy(config, candle) {

    let timestamp = lodash.flatten(candle.map(function (value) {
        return value.filter(function (value2, index2) {
            if (index2 === 0) {
                return value2
            }
        })
    }))
    let close = lodash.flatten(candle.map(function (value) {
        return value.filter(function (value2, index2) {
            if (index2 === 4) {
                return value2
            }
        })
    }))

    if (config.sma.status) {
        tulind.indicators.sma.indicator([close], [config.sma.period], function (err, result) {
            if (err) {
                console.log(err)
            } else {
                console.log('Resultado SMA')
                console.log(result[0])
            }
        })
    }

    if (config.macd.status) {

        const short = config.macd.shortPeriod
        const long = config.macd.longPeriod
        const signal = config.macd.signalPeriod

        tulind.indicators.macd.indicator([close], [short, long, signal], function (err, result) {
            if (err) {
                console.log(err)
            } else {
                let time = moment().set(timestamp.slice(-1))
                const digits = 4
                let preco = parseFloat(close.slice(-1))
                let macd = parseFloat(result[0].slice(-1))
                let sinal = parseFloat(result[1].slice(-1))
                let histograma = parseFloat(result[2].slice(-1))
                let macdiff = macd - sinal
                const tendencia = {
                    up: 1,
                    down: -1,
                    persistence: 1
                }
                console.log(chalk.cyan('########## Resultado MACD ##########'))
                console.log(chalk.magenta('Preço = ' + preco.toFixed(8) + ' - ' + time.format()))
                console.log(chalk.magenta('linha MACD = ' + macd.toFixed(digits)))
                console.log(chalk.magenta('linha Sinal = ' + sinal.toFixed(digits)))
                console.log(chalk.magenta('Histograma = ' + histograma.toFixed(digits)))
                console.log(chalk.magenta('Diferença MACD / Sinal = ' + macdiff.toFixed(digits)))

                // Logica de compra, se macd for menor que zero avalio se a linha de macd esta acima da linha
                // de sinal, se sim vejo se a tendencia se mantem por um periodo, se sim tenho um sinal de compra
                if (macd > 0 && macd < sinal) {
                    if (macdiff < tendencia.down) {
                        console.log(chalk.green('SINAL DE VENDA'))
                    }
                } else if (macd < 0 && macd > sinal) {
                    macdiffPositivo = Math.abs(macdiff)
                    if (macdiffPositivo > tendencia.up) {
                        console.log(chalk.red('SINAL DE COMPRA!'))
                    }
                } else {
                    console.log(chalk.yellow('NEUTRO'))
                }
            }
        })
    }

    if (config.rsi.status) {
        tulind.indicators.rsi.indicator([close], [config.rsi.period], function (err, result) {
            if (err) {
                console.log(err)
            } else {
                console.log('Resultado RSI')
                console.log(result[0])
            }
        })
    }
}

module.exports = { loadStrategy }