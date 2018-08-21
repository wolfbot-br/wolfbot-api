const bot = require('./bot.heart')

//requisição que aciona ou desliga o robo
const acionarRobo = async (req, res, next) => {
  try {

    params = {
      id_usuario: req.body.id_usuario || '',
      status: req.query.status || '',
      chave: req.query.chave || ''
    }

    if (params.status == 'on') {
      bot.roboLigado(params)
      res.status(200).json({
        'message': 'Robo Acionado',
        'status': '200'
      })
    } else if (params.status == 'off') {
      bot.roboDesligado(params)
      res.status(200).json({
        'message': 'Robo Desligado',
        'status': '200'
      })
    } else {
      throw new Error('ação inválida')
    }

  } catch (e) {
    res.status(400).json({
      'message': e.message,
      'status': '400'
    })
  }
}

module.exports = { acionarRobo }
