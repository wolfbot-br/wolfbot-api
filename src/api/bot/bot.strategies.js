const lodash = require('lodash')
const tulind = require('tulind')

function loadStrategy(config, candle) {

    const close = lodash.flatten(candle.map(function (value) {
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
                console.log('Resultado MACD')
                console.log('Preço ' + close.slice(-1))
                console.log('linha MACD ' + result[0].slice(-1))
                console.log('linha Sinal ' + result[1].slice(-1))
                console.log('Histograma ' + result[2].slice(-1))
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