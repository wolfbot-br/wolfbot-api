const lodash = require('lodash')
const tulind = require('tulind')
const moment = require('moment')
const chalk = require('chalk')

function loadStrategy(config, candle) {
  let resultMACD = {}
  const ordensCompra = []
  const ordensVenda = []
  const quantidadeOrdensAbertas = 10
  let contadorOrdensAbertas = 0
  let numeroOrdensCompra = 0
  let numeroOrdensVenda = 0
  const vendaPeloIndicador = false
  const profit = 0.02
  const stop = 0.1
  const digits = 4
  let preco = 0
  let time = moment
  time.locale('pt-br')
  const tendencia = {
    up: 1,
    down: -1,
    persistence: 1
  }

  const timestamp = []
  const open = []
  const high = []
  const low = []
  const close = []
  const volume = []

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
    ordensCompra.push({
      tipoOrdem: 'COMPRA',
      status: 'aberta',
      precoComprado: preco,
      fee: 0.0025,
      horaCompra: timeCompra.format('LLL'),
      target: profit,
      ordemCompraNumero: ++numeroOrdensCompra
    })
  }

  function criarOrdemVenda(preco, precoComprado, timeVenda, timeCompra) {
    ordensVenda.push({
      tipoOrdem: 'VENDA',
      status: 'fechada',
      precoComprado: precoComprado,
      horaCompra: timeCompra,
      precoVendido: preco,
      fee: 0.0025,
      lucroObtido: preco - precoComprado - (preco * 0.005),
      percentualGanho: (preco - precoComprado - (preco * 0.005)) / preco,
      horaVenda: timeVenda.format('LLL'),
      ordemVendaNumero: ++numeroOrdensVenda
    })
  }

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
      let macd = {}
      if (err) {
        console.log(err)
      } else {
        const arrayMacd = result[0]
        const arraySinal = result[1]
        const arrayHistograma = result[2]
        let cont2 = 0

        for (let i = long - 1; i <= close.length - 1; i++) {
          time = moment(timestamp[i])
          preco = parseFloat(close[i])
          let macd = parseFloat(arrayMacd[cont2])
          let sinal = parseFloat(arraySinal[cont2])
          let histograma = parseFloat(arrayHistograma[cont2])
          cont2++

          console.log(chalk.cyan('########## Resultado MACD ##########'))
          console.log(chalk.magenta('Posição = ' + i))
          console.log(chalk.magenta('Preço = ' + preco.toFixed(8) + ' - ' + time.format('LLL')))
          console.log(chalk.magenta('linha MACD = ' + macd.toFixed(digits)))
          console.log(chalk.magenta('linha Sinal = ' + sinal.toFixed(digits)))
          console.log(chalk.magenta('Histograma = ' + histograma.toFixed(digits)))

          // Logica de compra, se macd for menor que zero avalio se a linha de macd esta acima da linha
          // de sinal, se sim vejo se a tendencia se mantem por um periodo, se sim tenho um sinal de compra
          if (macd < 0) {
            if (histograma > tendencia.up && histograma < (tendencia.up + tendencia.persistence)) {
              console.log(chalk.red('SINAL DE COMPRA!'))
              if (contadorOrdensAbertas < quantidadeOrdensAbertas) {
                criarOrdemCompra(preco, time, profit)
                contadorOrdensAbertas++
              }
            } else {
              console.log(chalk.yellow('NEUTRO'))
            }
          } else if (vendaPeloIndicador === true) {
            if (macd > 0) {
              if ((histograma < tendencia.down && histograma > (tendencia.down - tendencia.persistence))) {
                console.log(chalk.green('SINAL DE VENDA'))
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
              } else {
                console.log(chalk.yellow('NEUTRO'))
              }
            }
          } else {
            console.log(chalk.yellow('NEUTRO'))
          }

          for (let j = 0; j < ordensCompra.length; j++) {
            if (ordensCompra[j].status === 'aberta') {
              if (preco >= ordensCompra[j].precoComprado + (ordensCompra[j].precoComprado * profit)) {
                ordensCompra[j].status = 'fechada'
                criarOrdemVenda(preco, ordensCompra[j].precoComprado, time, ordensCompra[j].horaCompra)
                contadorOrdensAbertas--
              } else if (preco <= ordensCompra[j].precoComprado - (ordensCompra[j].precoComprado * stop)) {
                ordensCompra[j].status = 'fechada'
                criarOrdemVenda(preco, ordensCompra[j].precoComprado, time, ordensCompra[j].horaCompra)
                contadorOrdensAbertas--
              }
            }
          }
        }
      }

      let resultadoLucro = 0
      let resultadoPercentual = 0
      for (let i = 0; i <= ordensVenda.length - 1; i++) {
        resultadoLucro += ordensVenda[i].lucroObtido
        resultadoPercentual += ordensVenda[i].percentualGanho
      }

      resultMACD = {
        ordersBuy: ordensCompra,
        ordersSell: ordensVenda,
        lucro: resultadoLucro,
        percentual: resultadoPercentual

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

  return {
    result: resultMACD
  }
}

module.exports = { loadStrategy }
