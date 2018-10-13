const lodash = require('lodash')
const tulind = require('tulind')
const moment = require('moment')
const order = require('../order/order.service');

function loadStrategy(config, candle, saldo, parMoedas, amount, user) {
    var data = new Array();
    var i = 0

    lodash.forEach([config], async function (indicadores) {
        lodash.filter(indicadores, function (res) {
            if (res.status) {
                i++
            }
        })
    })

    let timestamp = lodash.flatten(candle.map(function (value) {
        return value.filter(function (value2, index2) {
            if (index2 === 0) {
                return value2
            }
        })
    }))

    let open = lodash.flatten(candle.map(function (value) {
        return value.filter(function (value2, index2) {
            if (index2 === 1) {
                return value2
            }
        })
    }))

    let high = lodash.flatten(candle.map(function (value) {
        return value.filter(function (value2, index2) {
            if (index2 === 2) {
                return value2
            }
        })
    }))

    let low = lodash.flatten(candle.map(function (value) {
        return value.filter(function (value2, index2) {
            if (index2 === 3) {
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
                console.log(chalk.green.inverse('Saldo = ' + saldo))
                // Logica de compra, se macd for menor que zero avalio se a linha de macd esta acima da linha
                // de sinal, se sim vejo se a tendencia se mantem por um periodo, se sim tenho um sinal de compra
                if (macd > 0 && macd < sinal) {
                    if (macdiff < tendencia.down && macdiff > (tendencia.down - tendencia.persistence)) {
                        console.log(chalk.green('SINAL DE VENDA'))
                        data.push({
                            indicador: {
                                indicador_name: 'macd',
                                action: 'venda',
                                price: preco
                            }
                        })
                    } else {
                        console.log(chalk.yellow('NEUTRO'))
                        data.push({
                            indicador: {
                                indicador_name: 'macd',
                                action: 'neutro'
                            }
                        })
                    }
                } else if (macd < 0 && macd > sinal) {
                    macdiffPositivo = Math.abs(macdiff)
                    if (macdiffPositivo > tendencia.up && macdiffPositivo < (tendencia.up + tendencia.persistence)) {
                        console.log(chalk.red('SINAL DE COMPRA!'))
                        data.push({
                            indicador: {
                                indicador_name: 'macd',
                                action: 'compra',
                                price: preco
                            }
                        })
                    } else {
                        console.log(chalk.yellow('NEUTRO'))
                        data.push({
                            indicador: {
                                indicador_name: 'macd',
                                action: 'neutro'
                            }
                        })
                    }
                } else {
                    console.log(chalk.yellow('NEUTRO'))
                    data.push({
                        indicador: {
                            indicador_name: 'macd',
                            action: 'neutro'
                        }
                    })
                }
            }
        })
    }

    if (config.stoch.status) {
        const short = config.stoch.shortPeriod
        const long = config.stoch.longPeriod
        const signal = config.stoch.signalPeriod

        tulind.indicators.stoch.indicator([high, low, close], [long, short, signal], function (err, result) {
            if (err) {
                console.log(err)
            } else {
                let time = moment().set(timestamp.slice(-1))
                const digits = 0
                let preco = parseFloat(close.slice(-1))
                let k = parseFloat(result[0].slice(-1))
                let d = parseFloat(result[1].slice(-1))
                const tendencia = {
                    up: 80,
                    down: 20,
                }
                console.log(chalk.cyan('########## Resultado STOCH ##########'))
                console.log(chalk.magenta('Preço = ' + preco.toFixed(8) + ' - ' + time.format()))
                console.log(chalk.magenta('linha K = ' + k.toFixed(digits)))
                console.log(chalk.magenta('linha D = ' + d.toFixed(digits)))
                console.log(chalk.green.inverse('Saldo = ' + saldo))

                if (k.toFixed(digits) > tendencia.up && d.toFixed(digits) > tendencia.up) {
                    if (k.toFixed(digits) == d.toFixed(digits)) {
                        console.log(chalk.green('SINAL DE VENDA'))
                        data.push({
                            indicador: {
                                indicador_name: 'stoch',
                                action: 'venda',
                                price: preco
                            }
                        })
                    } else {
                        console.log(chalk.green('AREA DE VENDA'))
                        data.push({
                            indicador: {
                                indicador_name: 'stoch',
                                action: 'neutro'
                            }
                        })
                    }
                } else if (k.toFixed(digits) < tendencia.down && d.toFixed(digits) < tendencia.down) {
                    if (k.toFixed(digits) == d.toFixed(digits)) {
                        console.log(chalk.red('SINAL DE COMPRA'))
                        data.push({
                            indicador: {
                                indicador_name: 'stoch',
                                action: 'compra',
                                price: preco

                            }
                        })
                    } else {
                        console.log(chalk.red('AREA DE COMPRA'))
                        data.push({
                            indicador: {
                                indicador_name: 'stoch',
                                action: 'neutro'
                            }
                        })
                    }
                } else {
                    console.log(chalk.yellow('NEUTRO'))
                    data.push({
                        indicador: {
                            indicador_name: 'stoch',
                            action: 'neutro'
                        }
                    })
                }
            }
        })
    }

    var z = 0
    result = lodash.filter(data, function (res) {
        if (res.indicador.action == 'compra') {
            var indicador_ativos = Object.keys(res.indicador).length
            if (indicador_ativos == i) {
                while (z == 0) {
                    saldo_disponivel = parseFloat(close.slice(-1)) * amount
                    if (saldo > saldo_disponivel) {
                        const order_compra = {
                            type_operation: 'Automatic',
                            symbol: parMoedas,// Simbolo da cryptomoeda BTC/USDT
                            amount: amount, // Montante
                            price: parseFloat(close.slice(-1)), // Preço de venda
                            type: 'limit', // tipo: limite ou mercado
                            action: 'buy',
                            saldo: saldo,
                            user_id: user
                        }
                        order.comprar(order_compra)
                    }
                    z = 1
                }
            }
        }

        if (res.indicador.action == 'venda') {
            var indicador_ativos = Object.keys(res.indicador).length
            if (indicador_ativos == i) {
                while (z == 0) {
                    const order_venda = {
                        type_operation: 'Automatic',
                        symbol: parMoedas,// Simbolo da cryptomoeda BTC/USDT
                        amount: amount, // Montante
                        price: parseFloat(close.slice(-1)), // Preço de venda
                        type: 'limit', // tipo: limite ou mercado
                        action: 'sell',
                        saldo: saldo,
                        user_id: user
                    }
                    order.vender(order_venda)
                    z = 1
                }
            }
        }
    })
}

module.exports = { loadStrategy }
