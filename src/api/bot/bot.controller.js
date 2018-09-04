const bot = require('./bot.heart')

//requisição que aciona ou desliga o robo
const acionarRobo = async (req, res, next) => {
  try {

    params = {
      user_id: req.body.user_id,
      status_bot: req.body.status_bot
    }

    if (params.status_bot) {
      bot.roboLigado(params)
      res.status(200).json({
        'message': 'Robo Ligado',
        'status': '200'
      })
    } else {
      bot.roboDesligado(params)
      res.status(200).json({
        'message': 'Robo Desligado',
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

module.exports = { acionarRobo }
