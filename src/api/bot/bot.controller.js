const bot = require('./bot.heart')

//requisição que aciona ou desliga o robo
const acionarRobo = async (req, res, next) => {

  console.log(req.body.status)
  let botaoAcionar = req.body.status

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
