const lodash = require('lodash')
const tulind = require('tulind')
const moment = require('moment')

function loadStrategy(config, candle, market) {

  const ordersBuy = []
  const ordersSell = []
  const sellForIndicator = false
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
  let contOrdersOpen = 0
  let numberOrdersBuy = 0
  let numberOrdersSell = 0
  let price = 0
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

  function criarOrdemCompra(preco, timeCompra, profit) {
    ordersBuy.push({
      tipoOrdem: 'COMPRA',
      status: 'aberta',
      precoComprado: preco,
      fee: fee,
      horaCompra: timeCompra.format('LLL'),
      target: profit,
      ordemCompraNumero: ++numberOrdersBuy
    })
  }

  function criarOrdemVenda(preco, precoComprado, timeVenda, timeCompra) {
    ordersSell.push({
      tipoOrdem: 'VENDA',
      status: 'fechada',
      precoComprado: precoComprado,
      horaCompra: timeCompra,
      precoVendido: preco,
      fee: fee,
      lucroObtido: preco - precoComprado - (preco * 0.005),
      percentualGanho: (preco - precoComprado - (preco * 0.005)) / preco,
      horaVenda: timeVenda.format('LLL'),
      ordemVendaNumero: ++numberOrdersSell
    })
  }

  if (config.name === 'EMA') {
    const period = config.ema.period
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
            if (sellForIndicator === true) {
              if ((close[i] > tendenciaUP && close[i] < (tendenciaUP + tendencia.persistence))) {
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

  if (config.name === 'MACD') {
    const shortPeriod = config.short_period
    const longPeriod = config.long_period
    const signalPeriod = config.signal_period

    tulind.indicators.macd.indicator([close], [shortPeriod, longPeriod, signalPeriod], function (err, result) {
      if (err) {
        console.log(err)
      } else {
        const arrayMacd = result[0]
        const arrayHistograma = result[2]
        const tendencia = {
          up: 1,
          down: -1,
          persistence: 1
        }
        let cont2 = 0

        //LÓGICA PARA ENVIO DE SINAL DE COMPRA E VENDA COM INDICADOR
        for (let i = longPeriod - 1; i <= close.length - 1; i++) {
          let macd = parseFloat(arrayMacd[cont2])
          let histograma = parseFloat(arrayHistograma[cont2])
          cont2++

          if (macd < 0) {
            if (histograma > tendencia.up && histograma < (tendencia.up + tendencia.persistence)) {
              signalBUY.push({
                candle: i,
                indicator: 'MACD'
              })
            }
          } else if (macd > 0) {
            if ((histograma < tendencia.down && histograma > (tendencia.down - tendencia.persistence))) {
              signalSELL.push({
                candle: i,
                indicator: 'MACD'
              })
            }
          }
        }
      }
    })
  }

  if (config.name === 'RSI') {
    tulind.indicators.rsi.indicator([close], [config.rsi.period], function (err, result) {
      if (err) {
        console.log(err)
      } else {
        console.log('Resultado RSI')
        console.log(result[0])
      }
    })
  }

  for (let i = 0; i <= candle.length - 1; i++) {
    for (let j = 0; j <= signalBUY.length - 1; j++) {
      if (signalBUY[j].candle === i) {
        let preco = candle[i]
        criarOrdemCompra(preco, time, profit)
      }
    }
    if (sellForIndicator === true) {
      for (let k = 0; k <= signalSELL.length - 1; k++) {
        if (signalSELL[k].candle === i) {
          console.log('vender')
        }
      }
    } else {

    }
  }




  if (macd < 0) {
    if (histograma > tendencia.up && histograma < (tendencia.up + tendencia.persistence)) {
      if (contadorOrdensAbertas < quantidadeOrdensAbertas) {
        criarOrdemCompra(preco, time, profit)
        contadorOrdensAbertas++
      }
    }
  } else if (vendaPeloIndicador === true) {
    if (macd > 0) {
      if ((histograma < tendencia.down && histograma > (tendencia.down - tendencia.persistence))) {
        for (let j = 0; j < ordem.ordensCompra.length; j++) {
          if (ordem.ordensCompra[j].status === 'aberta') {
            if (preco >= ordem.ordensCompra[j].precoComprado + (ordem.ordensCompra[j].precoComprado * profit)) {
              ordensCompra[j].status = 'fechada'
              criarOrdemVenda(preco, ordem.ordensCompra[j].precoComprado, time)
              contadorOrdensAbertas--
            } else if (preco <= ordem.ordensCompra[j].precoComprado - (ordem.ordensCompra[j].precoComprado * stop)) {
              ordensCompra[j].status = 'fechada'
              criarOrdemVenda(preco, ordem.ordensCompra[j].precoComprado, time)
              contadorOrdensAbertas--
            }
          }
        }
      }
      // console.log(signalEMA)
      // console.log("\n")
      // console.log(signalMACD)

      // if (config.stoch.status) {
      //   tulind.indicators.stoch.indicator([high, low, close], [config.stoch.period_k, config.stoch.slow_period_k, config.stoch.period_d], function (err, result) {
      //     if (err) {
      //       console.log(err)
      //     } else {
      //       console.log('Resultado STOCK')
      //       console.log(result[0])
      //       console.log(result[1])
      //     }
      //   })
      // }

      // if (contadorOrdensAbertas < quantidadeOrdensAbertas) {
      //   criarOrdemCompra(preco, time, profit)
      //   contadorOrdensAbertas++
      // }

      // for (let j = 0; j < ordem.ordensCompra.length; j++) {
      //   if (ordem.ordensCompra[j].status === 'aberta') {
      //     if (preco >= ordem.ordensCompra[j].precoComprado + (ordem.ordensCompra[j].precoComprado * profit)) {
      //       ordensCompra[j].status = 'fechada'
      //       criarOrdemVenda(preco, ordem.ordensCompra[j].precoComprado, time)
      //       contadorOrdensAbertas--
      //     } else if (preco <= ordem.ordensCompra[j].precoComprado - (ordem.ordensCompra[j].precoComprado * stop)) {
      //       ordensCompra[j].status = 'fechada'
      //       criarOrdemVenda(preco, ordem.ordensCompra[j].precoComprado, time)
      //       contadorOrdensAbertas--
      //     }
      //   }
      // }

      // let resultadoLucro = 0
      // let resultadoPercentual = 0
      // for (let i = 0; i <= ordensVenda.length - 1; i++) {
      //   resultadoLucro += ordensVenda[i].lucroObtido
      //   resultadoPercentual += ordensVenda[i].percentualGanho
      // }

      // resultMACD = {
      //   ordersBuy: ordensCompra,
      //   ordersSell: ordensVenda,
      //   lucro: resultadoLucro,
      //   percentual: resultadoPercentual

      // }

      return {
        result: 'teste'
      }
    }

    module.exports = { loadStrategy }
