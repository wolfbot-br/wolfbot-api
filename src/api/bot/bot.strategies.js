const _ = require('lodash')
const tulind = require('tulind')
const moment = require('moment')
const order = require('../order/order.service')
const chalk = require('chalk')

function loadStrategy(config, target_currency, candle) {
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

    let signalBUY = false
    let signalSELL = false
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

    if (config.strategy.indicators.ema.status) {
        let short = 5//config.strategy.indicators.ema.short_period
        let long = 20//config.strategy.indicators.ema.long_period
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
        const tendencia = {
            persistence: 4
        }
        console.log(chalk.cyan('########## Resultado EMA ##########'))
        console.log(chalk.cyan(`moeda: ${target_currency}`))
        console.log(chalk.magenta('Preço = ' + price.toFixed(8) + ' - ' + time.format('DD-MM-YYYY HH:mm')))
        console.log(chalk.magenta('Preço Anterior = ' + previousPrice.toFixed(8)))
        console.log(chalk.magenta('linha SHORT EMA = ' + short_ema.toFixed(digits)))
        console.log(chalk.magenta('linha LONG EMA = ' + long_ema.toFixed(digits)))

        //LÓGICA PARA ENVIO DE SINAL DE COMPRA E VENDA COM INDICADOR
        let tendenciaUP = long_ema + tendencia.persistence
        let tendenciaDOWN = long_ema - tendencia.persistence

        if (short_ema > long_ema) {
            if (short_ema < tendenciaUP && price >= previousPrice) {
                console.log(chalk.red('SINAL DE COMPRA!'))
                signalBUY = true
            } else {
                console.log(chalk.yellow('NEUTRO'))
                signalBUY = false
            }
        } else if (sellForIndicator === true) {
            if (short_ema < long_ema) {
                if (short_ema > tendenciaDOWN && price <= previousPrice) {
                    console.log(chalk.green('SINAL DE VENDA'))
                    signalSELL = true
                } else {
                    console.log(chalk.yellow('NEUTRO'))
                    signalBUY = false
                }
            }
        } else {
            console.log(chalk.yellow('NEUTRO'))
        }
    }

    signalBUY = true
    if (signalBUY === true) {
        const params = {
            target_currency: target_currency,
            action: 'Automatic'
        }
        order.orderBuy(config, params)
    }


    //     if (config.macd.status) {
    //         const short = config.macd.shortPeriod
    //         const long = config.macd.longPeriod
    //         const signal = config.macd.signalPeriod

    //         tulind.indicators.macd.indicator([close], [short, long, signal], function (err, result) {
    //             if (err) {
    //                 console.log(err)
    //             } else {
    //                 let time = moment().set(timestamp.slice(-1))
    //                 const digits = 4
    //                 let preco = parseFloat(close.slice(-1))
    //                 let macd = parseFloat(result[0].slice(-1))
    //                 let sinal = parseFloat(result[1].slice(-1))
    //                 let histograma = parseFloat(result[2].slice(-1))
    //                 let macdiff = macd - sinal
    //                 const tendencia = {
    //                     up: 1,
    //                     down: -1,
    //                     persistence: 1
    //                 }
    //                 console.log(chalk.cyan('########## Resultado MACD ##########'))
    //                 console.log(chalk.magenta('Preço = ' + preco.toFixed(8) + ' - ' + time.format()))
    //                 console.log(chalk.magenta('linha MACD = ' + macd.toFixed(digits)))
    //                 console.log(chalk.magenta('linha Sinal = ' + sinal.toFixed(digits)))
    //                 console.log(chalk.magenta('Histograma = ' + histograma.toFixed(digits)))
    //                 console.log(chalk.magenta('Diferença MACD / Sinal = ' + macdiff.toFixed(digits)))
    //                 console.log(chalk.green.inverse('Saldo = ' + saldo))

    //                 // Logica de compra, se macd for menor que zero avalio se a linha de macd esta acima da linha
    //                 // de sinal, se sim vejo se a tendencia se mantem por um periodo, se sim tenho um sinal de compra
    //                 if (macd > 0 && macd < sinal) {
    //                     if (macdiff < tendencia.down && macdiff > (tendencia.down - tendencia.persistence)) {
    //                         console.log(chalk.green('SINAL DE VENDA'))
    //                         data.push({
    //                             indicador: {
    //                                 indicador_name: 'macd',
    //                                 action: 'venda',
    //                                 price: preco
    //                             }
    //                         })
    //                     } else {
    //                         console.log(chalk.yellow('NEUTRO'))
    //                         data.push({
    //                             indicador: {
    //                                 indicador_name: 'macd',
    //                                 action: 'neutro'
    //                             }
    //                         })
    //                     }
    //                 } else if (macd < 0 && macd > sinal) {
    //                     macdiffPositivo = Math.abs(macdiff)
    //                     if (macdiffPositivo > tendencia.up && macdiffPositivo < (tendencia.up + tendencia.persistence)) {
    //                         console.log(chalk.red('SINAL DE COMPRA!'))
    //                         data.push({
    //                             indicador: {
    //                                 indicador_name: 'macd',
    //                                 action: 'compra',
    //                                 price: preco
    //                             }
    //                         })
    //                     } else {
    //                         console.log(chalk.yellow('NEUTRO'))
    //                         data.push({
    //                             indicador: {
    //                                 indicador_name: 'macd',
    //                                 action: 'neutro'
    //                             }
    //                         })
    //                     }
    //                 } else {
    //                     console.log(chalk.yellow('NEUTRO'))
    //                     data.push({
    //                         indicador: {
    //                             indicador_name: 'macd',
    //                             action: 'neutro'
    //                         }
    //                     })
    //                 }
    //             }
    //         })
    //     }

    //     if (config.stoch.status) {
    //         const short = config.stoch.shortPeriod
    //         const long = config.stoch.longPeriod
    //         const signal = config.stoch.signalPeriod

    //         tulind.indicators.stoch.indicator([high, low, close], [long, short, signal], function (err, result) {
    //             if (err) {
    //                 console.log(err)
    //             } else {
    //                 let time = moment().set(timestamp.slice(-1))
    //                 const digits = 0
    //                 let preco = parseFloat(close.slice(-1))
    //                 let k = parseFloat(result[0].slice(-1))
    //                 let d = parseFloat(result[1].slice(-1))
    //                 const tendencia = {
    //                     up: 80,
    //                     down: 20,
    //                 }
    //                 console.log(chalk.cyan('########## Resultado STOCH ##########'))
    //                 console.log(chalk.magenta('Preço = ' + preco.toFixed(8) + ' - ' + time.format()))
    //                 console.log(chalk.magenta('linha K = ' + k.toFixed(digits)))
    //                 console.log(chalk.magenta('linha D = ' + d.toFixed(digits)))
    //                 console.log(chalk.green.inverse('Saldo = ' + saldo))

    //                 if (k.toFixed(digits) > tendencia.up && d.toFixed(digits) > tendencia.up) {
    //                     if (k.toFixed(digits) == d.toFixed(digits)) {
    //                         console.log(chalk.green('SINAL DE VENDA'))
    //                         data.push({
    //                             indicador: {
    //                                 indicador_name: 'stoch',
    //                                 action: 'venda',
    //                                 price: preco
    //                             }
    //                         })
    //                     } else {
    //                         console.log(chalk.green('AREA DE VENDA'))
    //                         data.push({
    //                             indicador: {
    //                                 indicador_name: 'stoch',
    //                                 action: 'neutro'
    //                             }
    //                         })
    //                     }
    //                 } else if (k.toFixed(digits) < tendencia.down && d.toFixed(digits) < tendencia.down) {
    //                     if (k.toFixed(digits) == d.toFixed(digits)) {
    //                         console.log(chalk.red('SINAL DE COMPRA'))
    //                         data.push({
    //                             indicador: {
    //                                 indicador_name: 'stoch',
    //                                 action: 'compra',
    //                                 price: preco

    //                             }
    //                         })
    //                     } else {
    //                         console.log(chalk.red('AREA DE COMPRA'))
    //                         data.push({
    //                             indicador: {
    //                                 indicador_name: 'stoch',
    //                                 action: 'neutro'
    //                             }
    //                         })
    //                     }
    //                 } else {
    //                     console.log(chalk.yellow('NEUTRO'))
    //                     data.push({
    //                         indicador: {
    //                             indicador_name: 'stoch',
    //                             action: 'neutro'
    //                         }
    //                     })
    //                 }
    //             }
    //         })
    //     }

    //     var z = 0
    //     result = lodash.filter(data, function (res) {
    //         if (res.indicador.action == 'compra') {
    //             var indicador_ativos = Object.keys(res.indicador).length
    //             if (indicador_ativos == i) {
    //                 while (z == 0) {
    //                     saldo_disponivel = parseFloat(close.slice(-1)) * amount
    //                     if (saldo > saldo_disponivel) {
    //                         const order_compra = {
    //                             type_operation: 'Automatic',
    //                             symbol: parMoedas,// Simbolo da cryptomoeda BTC/USDT
    //                             amount: amount, // Montante
    //                             price: parseFloat(close.slice(-1)), // Preço de venda
    //                             type: 'limit', // tipo: limite ou mercado
    //                             action: 'buy',
    //                             saldo: saldo,
    //                             user_id: user
    //                         }
    //                         order.comprar(order_compra)
    //                     }
    //                     z = 1
    //                 }
    //             }
    //         }

    //         if (res.indicador.action == 'venda') {
    //             var indicador_ativos = Object.keys(res.indicador).length
    //             if (indicador_ativos == i) {
    //                 while (z == 0) {
    //                     const order_venda = {
    //                         type_operation: 'Automatic',
    //                         symbol: parMoedas,// Simbolo da cryptomoeda BTC/USDT
    //                         amount: amount, // Montante
    //                         price: parseFloat(close.slice(-1)), // Preço de venda
    //                         type: 'limit', // tipo: limite ou mercado
    //                         action: 'sell',
    //                         saldo: saldo,
    //                         user_id: user
    //                     }
    //                     order.vender(order_venda)
    //                     z = 1
    //                 }
    //             }
    //         }
    //     })
}

module.exports = { loadStrategy }
