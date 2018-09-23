const backtest = require('./backtest.heart')

const testarConfiguracao = async (req, res, next) => {
  try {
    params = {
      user_id: req.body.user_id,
      date_timestamp: req.body.date
    }

    backtest.carregarDados(params)
      .then(function (resp) {
        res.status(200).json({
          data: resp,
          status: '200'
        })
      })
  } catch (e) {
    res.status(400).json({
      'message': e.message,
      'status': '400'
    })
  }
}

module.exports = { testarConfiguracao }
