const lodash = require('lodash')
const tulind = require('tulind')
const moment = require('moment')
const order = require('../order/order.service');

function loadStrategy(config, candle, saldo, config) {

    let user = config.user
    let amount = config.amount
    let target = config.target
    const parMoedas = `${config.target_currency}/${config.base_currency}`

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

                console.log('########## Resultado MACD ##########')
                console.log('Preço = ' + preco.toFixed(8) + ' - ' + time.format())
                console.log('linha MACD = ' + macd.toFixed(digits))
                console.log('linha Sinal = ' + sinal.toFixed(digits))
                console.log('Histograma = ' + histograma.toFixed(digits))
                console.log('Diferença MACD / Sinal = ' + macdiff.toFixed(digits))

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
                        console.log(saldo)
                        // Logica de compra, se macd for menor que zero avalio se a linha de macd esta acima da linha
                        // de sinal, se sim vejo se a tendencia se mantem por um periodo, se sim tenho um sinal de compra
                        if (macd > 0 && macd < sinal) {
                            if (macdiff < tendencia.down && macdiff > (tendencia.down - tendencia.persistence)) {
                                console.log(chalk.green('SINAL DE VENDA'))
                                params = {
                                    user_id: user,
                                    type_operation: 'Automatic',
                                    symbol: parMoedas,// Simbolo da cryptomoeda BTC/USDT
                                    amount: amount, // Montante
                                    price: preco, // Preço de venda
                                    type: 'limit' // tipo: limite ou mercado
                                }
                                console.log(params)
                                // order.vender(params);
                            } else {
                                console.log(chalk.yellow('NEUTRO'))
                            }
                        } else if (macd < 0 && macd > sinal) {
                            macdiffPositivo = Math.abs(macdiff)
                            if (macdiffPositivo > tendencia.up && macdiffPositivo < (tendencia.up + tendencia.persistence)) {
                                console.log(chalk.red('SINAL DE COMPRA!'))

                                if (saldo > 0) {
                                    let preco_real = preco * amount
                                    if (saldo >= preco_real) {
                                        params = {
                                            user_id: user,
                                            type_operation: 'Automatic',
                                            symbol: parMoedas,// Simbolo da cryptomoeda BTC/USDT
                                            amount: amount, // Montante
                                            price: preco, // Preço de venda
                                            type: 'limit' // tipo: limite ou mercado
                                        }

                                        order.comprar(params);
                                    }
                                }
                            } else {
                                console.log(chalk.yellow('NEUTRO'))
                            }
                        } else {
                            console.log(chalk.yellow('NEUTRO'))
                        }
                    }
                })
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
