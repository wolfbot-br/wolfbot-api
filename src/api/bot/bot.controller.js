const ccxt = require('ccxt')
const tulind = require('tulind')
const configuracao = require('../../infraestrutura/mongo/models/configuracao.model')
const utilService = require('../util/util.service')
const serviceBot = require('../bot/bot.service')
const exchangeValidation = require('../exchanges/exchanges.validation')
const bot = require('./bot.heart')

const index = async (req, res, next) => {
  res.send('<h1 style="text-align:center;">Monitoramento - WOLFBOT</h1>')
}

//requisição que aciona ou desliga o robo
const acionarRobo = async (req, res, next) => {

  try {

    params = {
      status: req.body.status,
      chave: req.body.chave
    }

    if (params.status == 'on')
      bot.roboLigado(params)
    else if (params.status == 'off')
      bot.roboDesligado(params)
    else
      throw new Error('ação inválida')

  } catch (e) {
    res.status(400).json({
      'message': e.message,
      'status': '400'
    })
  }
}

const monitoramento = async (req, res, next) => {
  try {
    params = {
      status: req.body.status,
      id_usuario: req.body.id_usuario,
      id_exchange: req.body.id_exchange,
      intervalo: req.body.intervalo
    }

    /* Mandando o id_usuario e o id_exchange eu pego toda configuração já configurada pelo o usuário
        para seguir a regra de negocio do robo, e também ja aproveito e vejo qual exchange eu tenho que
        instanciar pelo o "id_exchange" */

    exchangeValidation.validarDados(params)
    const credenciais = await configuracao
      .findOne({ 'usuario.id_usuario': params.id_usuario })
      .where({ 'exchange.id_exchange': params.id_exchange })

    exchangeValidation.validarRequisitosExchange(credenciais)

    const nome_exchange = credenciais.exchange.nome_exchange.toLowerCase()
    exchange = utilService.selecionarExchange(nome_exchange)

    if (params.status == 'online' || params.status == 'offline') {
      var promise = Promise.resolve(true)

      if (params.status == 'online') {
        serviceBot.play(params)
      }

      // Inicia o bot
      var playbot = setInterval(async function () {
        if (params.status == 'offline') {
          // Pausa o bot
          serviceBot.stop(playbot, params)
          promise = promise.then(function () {
            return new Promise(function (resolve) {
              msg = 'Bot pausado.'
              console.log(msg)
              response(msg, resolve)
            })
          })
        } else {
          let sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
          var high = []
          var low = []
          var close = []

          if (exchange.has.fetchOHLCV) {
            var hoje = new Date()
            hoje.setMinutes(hoje.getMinutes() - 30)
            var tempo = new Date(hoje).getTime()

            await sleep(exchange.rateLimit) // milliseconds
            result = await exchange.fetchOHLCV('IOTA/USDT', '1m', since = tempo, limit = 100)
            totalResult = Object.keys(result).length

            for (i = 0; i < totalResult; i++) {
              high.push(result[i][2])
              low.push(result[i][3])
              close.push(result[i][4])
            }
          }

          tulind.indicators.macd.indicator([close], [2, 5, 9], function (error, results) {
            console.log('Result of macd is:')
            console.log(results)
          })

          promise = promise.then(function () {
            return new Promise(function (resolve) {
              msg = 'Bot iniciado, consulte o terminal para ver o resultado.'
              response(msg, resolve)
            })
          })
        }
      },
        10000
      )
    }

    function response(msg, resolve) {
      res.status(200).json({
        'message': msg,
        'status': '200'
      })
    }
  } catch (e) {
    res.status(400).json({
      'message': e.message,
      'status': '400'
    })
  }
}

module.exports = { acionarRobo, monitoramento }
