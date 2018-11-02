const _ = require('lodash')
const tulind = require('tulind')
const moment = require('moment')
const order = require('../order/order.service')
const chalk = require('chalk')

async function loadStrategy(config, params, target_currency, candle, ordersOpen) {
    const digits = 4
    const sellForIndicator = config.sellForIndicator
    const profit = config.profit
    const stop = config.stop
    const timestamp = []
    const open = []
    const high = []
    const low = []
    const close = []
    const volume = []
    const params_order = {
        target_currency: target_currency,
        action: 'Automatic'
    }

    let signal = []
    let signalSELL = {
        ema: false,
        macd: false
    }
    let status_BUY = params.status_buy
    let status_SELL = params.status_sell
    let time = moment
    time.locale('pt-br')

    _.flatten(candle.map(function (value) {
        return value.filter(function (value2, index2) {
            if (index2 === 0) {
                timestamp.push(value2)
            }
            if (index2 === 1) {
                open.push(value2)
            }
            if (index2 === 2) {
                high.push(value2)
            }
            if (index2 === 3) {
                low.push(value2)
            }
            if (index2 === 4) {
                close.push(value2)
            }
            if (index2 === 5) {
                volume.push(value2)
            }
        })
    }))

    let price = parseFloat(close.slice(-1))

    //############################### INDICADOR EMA ################################
    if (config.strategy.indicators.ema.status) {
        let short = config.strategy.indicators.ema.short_period
        let long = config.strategy.indicators.ema.long_period
        let short_ema = 0
        let long_ema = 0
        tulind.indicators.ema.indicator([close], [short], function (err, result) {
            if (err) {
                console.log(err)
            } else {
                short_ema = parseFloat(result[0].slice(-1))
            }
        })
        tulind.indicators.ema.indicator([close], [long], function (err, result) {
            if (err) {
                console.log(err)
            } else {
                long_ema = parseFloat(result[0].slice(-1))
            }
        })
        time = moment().set(timestamp.slice(-1))
        let previousPrice = parseFloat(close.slice(-2))
        const trend = {
            persistence: 0.25
        }
        console.log(chalk.cyan('########## Resultado EMA ##########'))
        console.log(chalk.cyan(`moeda: ${target_currency}`))
        console.log(chalk.magenta('Preço = ' + price.toFixed(8) + ' - ' + time.format('DD-MM-YYYY HH:mm')))
        console.log(chalk.magenta('Preço Anterior = ' + previousPrice.toFixed(8)))
        console.log(chalk.magenta('linha SHORT EMA = ' + short_ema.toFixed(digits)))
        console.log(chalk.magenta('linha LONG EMA = ' + long_ema.toFixed(digits)))

        //LÓGICA PARA ENVIO DE SINAL DE COMPRA E VENDA COM INDICADOR
        let trend_UP = long_ema + trend.persistence
        let trend_DOWN = long_ema - trend.persistence

        if (short_ema > long_ema) {
            if (short_ema < trend_UP && price >= previousPrice) {
                console.log(chalk.red('SINAL DE COMPRA!'))
                signal.push({
                    indicator: 'EMA',
                    buy: true,
                    sell: false
                })
            } else {
                console.log(chalk.yellow('NEUTRO'))
                signal.push({
                    indicator: 'EMA',
                    buy: false,
                    sell: false
                })
            }
        } else if (sellForIndicator === true) {
            if (short_ema < long_ema) {
                if (short_ema > trend_DOWN && price <= previousPrice) {
                    console.log(chalk.green('SINAL DE VENDA'))
                    signal.push({
                        indicator: 'EMA',
                        buy: false,
                        sell: true
                    })
                } else {
                    console.log(chalk.yellow('NEUTRO'))
                    signal.push({
                        indicator: 'EMA',
                        buy: false,
                        sell: false
                    })
                }
            }
        } else {
            console.log(chalk.yellow('NEUTRO'))
            signal.push({
                indicator: 'EMA',
                buy: false,
                sell: false
            })
        }
    }


    //############################### INDICADOR MACD ################################
    if (config.strategy.indicators.macd.status) {
        const shortPeriod = config.strategy.indicators.macd.short_period
        const longPeriod = config.strategy.indicators.macd.long_period
        const signalPeriod = config.strategy.indicators.macd.signal_period

        tulind.indicators.macd.indicator([close], [shortPeriod, longPeriod, signalPeriod], function (err, result) {
            if (err) {
                console.log(err)
            } else {
                const trend = {
                    up: 0.025,
                    down: 0.025,
                    persistence: 1
                }
                let time = moment().set(timestamp.slice(-1))
                let price = parseFloat(close.slice(-1))
                let previousPrice = parseFloat(close.slice(-2))
                let macd = parseFloat(result[0].slice(-1))
                let signal_macd = parseFloat(result[1].slice(-1))
                let histogram = parseFloat(result[2].slice(-1))

                console.log(chalk.cyan('########## Resultado MACD ##########'))
                console.log(chalk.cyan(`moeda: ${target_currency}`))
                console.log(chalk.magenta('Preço = ' + price.toFixed(8) + ' - ' + time.format('DD-MM-YYYY HH:mm')))
                console.log(chalk.magenta('Preço Anterior = ' + previousPrice.toFixed(8)))
                console.log(chalk.magenta('linha Sinal = ' + signal_macd.toFixed(digits)))
                console.log(chalk.magenta('Histograma = ' + histogram.toFixed(digits)))

                //LÓGICA PARA ENVIO DE SINAL DE COMPRA E VENDA COM INDICADOR
                if (macd < 0) {
                    if (histogram > trend.up && histogram < (trend.up + trend.persistence) && close[i] >= close[i - 1]) {
                        console.log(chalk.red('SINAL DE COMPRA!'))
                        signal.push({
                            indicator: 'MACD',
                            buy: true,
                            sell: false
                        })
                    } else {
                        console.log(chalk.yellow('NEUTRO'))
                        signal.push({
                            indicator: 'MACD',
                            buy: false,
                            sell: false
                        })
                    }
                } else if (sellForIndicator === true) {
                    if (macd > 0) {
                        if ((histogram < trend.down && histogram > (trend.down - trend.persistence))) {
                            console.log(chalk.green('SINAL DE VENDA'))
                            signal.push({
                                indicator: 'MACD',
                                buy: false,
                                sell: true
                            })
                        } else {
                            console.log(chalk.yellow('NEUTRO'))
                            signal.push({
                                indicator: 'MACD',
                                buy: false,
                                sell: false
                            })
                        }
                    }
                } else {
                    console.log(chalk.yellow('NEUTRO'))
                    signal.push({
                        indicator: 'MACD',
                        buy: false,
                        sell: false
                    })
                }
            }
        })
    }

    console.log(config.strategy.indicators.stoch.d_period)
    console.log(config.strategy.indicators.macd.short_period)
    //############################### INDICADOR STOCH ################################
    if (config.strategy.indicators.stoch.status) {
        const kPeriod = config.strategy.indicators.stoch.k_period
        const kSlowPeriod = config.strategy.indicators.stoch.k_slow_period
        const dPeriod = config.strategy.indicators.stoch.d_period
        tulind.indicators.stoch.indicator([high, low, close], [kPeriod, kSlowPeriod, dPeriod], function (err, result) {
            if (err) {
                console.log(err)
            } else {
                const trend = {
                    up: 0.025,
                    down: 0.025,
                    persistence: 1
                }
                let time = moment().set(timestamp.slice(-1))
                let price = parseFloat(close.slice(-1))
                let previousPrice = parseFloat(close.slice(-2))
                let k = parseFloat(result[0].slice(-1))
                let d = parseFloat(result[1].slice(-1))

                console.log(chalk.cyan('########## Resultado STOCH ##########'))
                console.log(chalk.cyan(`moeda: ${target_currency}`))
                console.log(chalk.magenta('Preço = ' + price.toFixed(8) + ' - ' + time.format('DD-MM-YYYY HH:mm')))
                console.log(chalk.magenta('Preço Anterior = ' + previousPrice.toFixed(8)))
                console.log(chalk.magenta('linha K = ' + k.toFixed(digits)))
                console.log(chalk.magenta('linha D = ' + d.toFixed(digits)))

                //LÓGICA PARA ENVIO DE SINAL DE COMPRA E VENDA COM INDICADOR
                if (k > 20) {
                    if (k > d && k < (trend.up + 20) && close[i] >= close[i - 1]) {
                        console.log(chalk.red('SINAL DE COMPRA!'))
                        signal.push({
                            indicator: 'STOCH',
                            buy: true,
                            sell: false
                        })
                    } else {
                        console.log(chalk.yellow('NEUTRO'))
                        signal.push({
                            indicator: 'STOCH',
                            buy: false,
                            sell: false
                        })
                    }
                } else if (sellForIndicator === true) {
                    if (k < 80) {
                        if (k < d && k > (80 - trend.down) && close[i] <= close[i - 1]) {
                            console.log(chalk.green('SINAL DE VENDA'))
                            signal.push({
                                indicator: 'STOCH',
                                buy: false,
                                sell: true
                            })
                        } else {
                            console.log(chalk.yellow('NEUTRO'))
                            signal.push({
                                indicator: 'STOCH',
                                buy: false,
                                sell: false
                            })
                        }
                    }
                } else {
                    console.log(chalk.yellow('NEUTRO'))
                    signal.push({
                        indicator: 'STOCH',
                        buy: false,
                        sell: false
                    })
                }
            }
        })
    }

    //############################### INDICADOR CCI ################################

    //############################### INDICADOR BBANDS ################################

    //CÓDIGO QUE CHAMA FUNÇÃO RESPONSÁVEL POR INSERIR UMA ORDEM DE COMPRA
    if (status_BUY === true) {
        let contIndicators = signal.length
        let contSignals = 0
        for (i in signal) {
            if (signal[i].buy === true) {
                contSignals++
            }
        }

        console.log(contIndicators)
        console.log(contSignals)
        if (contIndicators === contSignals) {
            console.log(chalk.green('ORDEM DE COMPRA CRIADA'))
            order.orderBuy(config, params_order)
        }
    }

    //CÓDIGO QUE CHAMA FUNÇÃO RESPONSÁVEL POR INSERIR UMA ORDEM DE VENDA

    if (status_SELL === true) {
        if (sellForIndicator === true) {
            if (signalSELL === true) {
                console.log('estou aqui')
            }
        } else if (ordersOpen !== null) {
            for (let i = 0; i <= ordersOpen.length - 1; i++) {
                if (price >= ordersOpen[i].price + (ordersOpen[i].price * profit)) {
                    console.log(chalk.green('ORDEM DE VENDA CRIADA'))
                    await order.orderSell(config, params_order, ordersOpen[i])
                    await order.orderUpdateStatus(params_order, ordersOpen[i])
                } else if (price <= ordersOpen[i].price - (ordersOpen[i].price * stop)) {
                    console.log(chalk.green('VENDI COM PERDA, NO MEU STOP'))
                    await order.orderSell(config, params_order, ordersOpen[i])
                    await order.orderUpdateStatus(params_order, ordersOpen[i])
                }
            }
        }
    }
}

module.exports = { loadStrategy }
