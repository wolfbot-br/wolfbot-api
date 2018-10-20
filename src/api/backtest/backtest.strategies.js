const lodash = require('lodash')
const tulind = require('tulind')
const moment = require('moment')

function loadStrategy(config, candle, market) {

  const ordersBuy = []
  const ordersSell = []
  const sellForIndicator = config.sellForIndicator
  const profit = config.profit
  const stop = config.stop
  const fee = market.taker
  const timestamp = []
  const open = []
  const high = []
  const low = []
  const close = []
  const volume = []

  let signalBUY = []
  let signalSELL = []
  let numberOrdersBuy = 0
  let numberOrdersSell = 0
  let time = moment
  time.locale('pt-br')

  lodash.flatten(candle.map(function (value) {
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

  if (config.indicator.name === 'EMA') {
    const period = config.indicator.ema_period
    tulind.indicators.ema.indicator([close], [period], function (err, result) {
      if (err) {
        console.log(err)
      } else {
        const arrayEMA = result[0]
        const tendencia = {
          up: 2,
          down: -2,
          persistence: 2
        }
        let cont2 = 0


        //LÓGICA PARA ENVIO DE SINAL DE COMPRA E VENDA COM INDICADOR
        for (let i = period - 1; i <= close.length - 1; i++) {
          let ema = parseFloat(arrayEMA[cont2])
          let tendenciaUP = ema + tendencia.up
          let tendenciaDOWN = ema + tendencia.down
          cont2++

          if (close[i] < ema) {
            if (close[i] < tendenciaDOWN && close[i] > (tendenciaDOWN - tendencia.persistence)) {
              signalBUY.push({
                candle: i,
                indicator: 'EMA'
              })
            }
          } else if (close[i] > ema) {
            if ((close[i] > tendenciaUP && close[i] < (tendenciaUP + tendencia.persistence))) {
              if (sellForIndicator === true) {
                signalSELL.push({
                  candle: i,
                  indicator: 'EMA'
                })
              }
            }
          }
        }
      }
    })
  }

  if (config.indicator.name === 'MACD') {
    const shortPeriod = config.indicator.macd_short_period
    const longPeriod = config.indicator.macd_long_period
    const signalPeriod = config.indicator.macd_signal_period

    tulind.indicators.macd.indicator([close], [shortPeriod, longPeriod, signalPeriod], function (err, result) {
      if (err) {
        console.log(err)
      } else {
        const arrayMacd = result[0]
        const arrayHistograma = result[2]
        const tendencia = {
          up: 0.025,
          down: 0.025,
          persistence: 1
        }
        let cont2 = 0

        //LÓGICA PARA ENVIO DE SINAL DE COMPRA E VENDA COM INDICADOR
        for (let i = longPeriod + 1; i <= candle.length - 1; i++) {
          let macd = parseFloat(arrayMacd[cont2])
          let histograma = parseFloat(arrayHistograma[cont2])
          cont2++

          if (macd < 0) {
            if (histograma > tendencia.up && histograma < (tendencia.up + tendencia.persistence) && close[i] >= close[i - 1]) {
              signalBUY.push({
                candle: i,
                indicator: 'MACD'
              })
            }
          } else if (macd > 0) {
            if ((histograma < tendencia.down && histograma > (tendencia.down - tendencia.persistence))) {
              if (sellForIndicator === true) {
                signalSELL.push({
                  candle: i,
                  indicator: 'MACD'
                })
              }
            }
          }
        }
      }
    })
  }

  if (config.indicator.name === 'STOCH') {
    const k_period = config.indicator.stoch_k_period
    const k_slow_period = config.indicator.stoch_k_slow_period
    const d_period = config.indicator.stoch_d_period
    tulind.indicators.stoch.indicator([high, low, close], [k_period, k_slow_period, d_period], function (err, result) {
      if (err) {
        console.log(err)
      } else {
        const arrayK = result[0]
        const arrayD = result[1]
        const tendencia = {
          up: 5,
          down: 5,
        }
        let cont2 = 0

        //LÓGICA PARA ENVIO DE SINAL DE COMPRA E VENDA COM INDICADOR
        for (let i = k_period + 1; i <= candle.length - 1; i++) {
          let k = parseFloat(arrayK[cont2])
          let d = parseFloat(arrayD[cont2])
          cont2++

          if (k > 20) {
            if (k > d && k < (tendencia.up + 20) && close[i] >= close[i - 1]) {
              signalBUY.push({
                candle: i,
                indicator: 'STOCH'
              })
            }
          } else if (k < 80) {
            if (k < d && k > (80 - tendencia.down) && close[i] <= close[i - 1]) {
              if (sellForIndicator === true) {
                signalSELL.push({
                  candle: i,
                  indicator: 'STOCH'
                })
              }
            }
          }
        }
      }
    })
  }

  if (config.indicator.name === 'CCI') {
    const period = config.indicator.cci_period
    tulind.indicators.cci.indicator([high, low, close], [period], function (err, result) {
      if (err) {
        console.log(err)
      } else {
        const arrayCCI = result[0]
        const tendencia = {
          up: 5,
          down: -5,
        }
        let cont2 = 0

        //LÓGICA PARA ENVIO DE SINAL DE COMPRA E VENDA COM INDICADOR
        for (let i = period + 1; i <= candle.length - 1; i++) {
          let cci = parseFloat(arrayCCI[cont2])
          cont2++

          if (cci > 100 && cci < (tendencia.up + 100) && close[i] >= close[i - 1]) {
            signalBUY.push({
              candle: i,
              indicator: 'STOCH'
            })
          } else if (cci < -100 && cci > (tendencia.up - 100) && close[i] <= close[i - 1]) {
            if (sellForIndicator === true) {
              signalSELL.push({
                candle: i,
                indicator: 'STOCH'
              })
            }
          }
        }
      }
    })
  }

  if (config.indicator.name === 'BOLLINGER BANDS') {
    const period = config.indicator.bbands_period
    const stddev = config.indicator.bbands_stddev_period
    tulind.indicators.bbands.indicator([close], [period, stddev], function (err, result) {
      if (err) {
        console.log(err)
      } else {
        const arrayBBANDS_lower = result[0]
        const arrayBBANDS_middle = result[1]
        const arrayBBANDS_upper = result[2]
        const tendencia = {
          up: 5,
          down: 5,
        }
        let cont2 = 0

        //LÓGICA PARA ENVIO DE SINAL DE COMPRA E VENDA COM INDICADOR
        for (let i = period + 1; i <= candle.length - 1; i++) {
          let lower = parseFloat(arrayBBANDS_lower[cont2])
          let middle = parseFloat(arrayBBANDS_middle[cont2])
          let upper = parseFloat(arrayBBANDS_upper[cont2])
          cont2++

          if (close[i] <= lower && close[i] > (lower - tendencia.down) && close[i] >= close[i - 1]) {
            signalBUY.push({
              candle: i,
              indicator: 'STOCH'
            })
          } else if (close[i] >= upper && close[i] < (upper + tendencia.up) && close[i] <= close[i - 1]) {
            if (sellForIndicator === true) {
              signalSELL.push({
                candle: i,
                indicator: 'STOCH'
              })
            }
          }
        }
      }
    })
  }

  for (let i = 0; i <= candle.length - 1; i++) {
    for (let j = 0; j <= signalBUY.length - 1; j++) {
      if (signalBUY[j].candle === i) {
        let preco = parseFloat(candle[i][4])
        let time = moment(candle[i][0])
        ordersBuy.push({
          candle: i,
          tipoOrdem: 'COMPRA',
          status: 'aberta',
          precoComprado: preco,
          close: close[i],
          horaCompra: time.format('DD-MM-YYYY HH:mm'),
          target: profit,
          ordemCompraNumero: ++numberOrdersBuy
        })
      }
    }
    if (sellForIndicator === true) {
      for (let k = 0; k <= ordersBuy.length - 1; k++) {
        if (ordersBuy[k].status === 'aberta') {
          for (let x = 0; x <= signalSELL.length - 1; x++) {
            if (signalSELL[x].candle === i) {
              let preco = parseFloat(candle[i][4])
              let time = moment(candle[i][0])
              ordersSell.push({
                candle: i,
                tipoOrdem: 'VENDA',
                status: 'fechada',
                precoComprado: ordersBuy[k].precoComprado,
                horaCompra: ordersBuy[k].horaCompra,
                precoVendido: preco,
                taxaNegociacao: preco * (2 * parseFloat(fee)),
                lucroObtido: preco - ordersBuy[k].precoComprado - (preco * (2 * parseFloat(fee))),
                percentualGanho: (preco - ordersBuy[k].precoComprado - (preco * (2 * parseFloat(fee)))) / preco,
                horaVenda: time.format('DD-MM-YYYY HH:mm'),
                ordemVendaNumero: ++numberOrdersSell
              })
            }
          }
        }
      }
    } else {
      for (let x = 0; x <= ordersBuy.length - 1; x++) {
        if (ordersBuy[x].status === 'aberta') {
          let preco = parseFloat(candle[i][4])
          let time = moment(candle[i][0])
          if (preco >= ordersBuy[x].precoComprado + (ordersBuy[x].precoComprado * profit)) {
            ordersBuy[x].status = 'fechada'
            ordersSell.push({
              candle: i,
              tipoOrdem: 'VENDA',
              status: 'fechada',
              precoComprado: ordersBuy[x].precoComprado,
              horaCompra: ordersBuy[x].horaCompra,
              precoVendido: preco,
              taxaNegociacao: preco * (2 * parseFloat(fee)),
              lucroObtido: preco - ordersBuy[x].precoComprado - (preco * (2 * parseFloat(fee))),
              percentualGanho: (preco - ordersBuy[x].precoComprado - (preco * (2 * parseFloat(fee)))) / preco,
              horaVenda: time.format('DD-MM-YYYY HH:mm'),
              ordemVendaNumero: ++numberOrdersSell
            })
          } else if (preco <= ordersBuy[x].precoComprado - (ordersBuy[x].precoComprado * stop)) {
            ordersBuy[x].status = 'fechada'
            ordersSell.push({
              candle: i,
              tipoOrdem: 'VENDA',
              status: 'fechada',
              precoComprado: ordersBuy[x].precoComprado,
              horaCompra: ordersBuy[x].horaCompra,
              precoVendido: preco,
              taxaNegociacao: preco * (2 * parseFloat(fee)),
              lucroObtido: preco - ordersBuy[x].precoComprado - (preco * (2 * parseFloat(fee))),
              percentualGanho: (preco - ordersBuy[x].precoComprado - (preco * (2 * parseFloat(fee)))) / preco,
              horaVenda: time.format('DD-MM-YYYY HH:mm'),
              ordemVendaNumero: ++numberOrdersSell
            })
          }
        }
      }
    }
  }

  let profitResult = 0
  let percentageResult = 0
  for (let i = 0; i <= ordersSell.length - 1; i++) {
    profitResult += ordersSell[i].lucroObtido
    percentageResult += ordersSell[i].percentualGanho
  }

  return {
    ordersBuy: ordersBuy,
    ordersSell: ordersSell,
    profit: profitResult,
    percentage: percentageResult
  }
}

module.exports = { loadStrategy }
