const bot = require('./bot.heart')

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
  try {
    if (botaoAcionar === true) {
      bot.roboLigado(botaoAcionar)
      res.status(200).json({
        'message': 'Robo Ligado',
        'status': '200'
      })
    } else {
      bot.roboLigado(botaoAcionar)
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
