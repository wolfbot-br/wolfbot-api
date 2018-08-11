const ccxt = require('ccxt')
const moment = require('moment')

// MÉTODO RESPONSÁVEL POR CARREGAR CANDLES(VELAS) DE DADOS DE MERCADO
// @params
// exchange = 'bittrex', 'poloniex', etc...
// parMoedas = 'BTC/USDT', 'ETC/USDT', etc...
// quantidadePeriodos = 3, 5, 10, etc...
// tamanhoCandle = '5m', '15m', '30m', '1h', '1d'
// intervaloLoad = 10000, 50000, etc.. em milisegundos
function loadCandles(exchange, parMoedas, quantidadePeriodos, tamanhoCandle, intervaloLoad) {
    exchangeCCXT = new ccxt[exchange]()
    const index = 4 // [ timestamp, open, high, low, close, volume ]
    let periodo = ''
    const unidadeTempo = tamanhoCandle.substr(-1)
    const unidadeTamanho = Number.parseInt(tamanhoCandle.substr(0))

    if (unidadeTempo === 'm') {
        periodo = 'minutes'
    } else if (unidadeTempo === 'h') {
        periodo = 'hours'
    } else {
        periodo = 'days'
    }
    const tempo = moment().subtract(quantidadePeriodos * unidadeTamanho, periodo)

    setInterval(
        async function load() {
            const candle = await exchangeCCXT.fetchOHLCV(parMoedas, tamanhoCandle, since = tempo.valueOf(), limit = 1000)
            const candleTime = candle[candle.length - 5][index] // timestamp
            const lastPrice = candle[candle.length - 1][index] // preço de fechamento
            console.log(candle)
        }, intervaloLoad
    )
}

module.exports = { loadCandles }

