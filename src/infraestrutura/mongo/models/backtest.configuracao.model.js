const mongoose = require('mongoose')

const backtestConfiguracao = new mongoose.Schema({
  name: { type: String },
  exchange: { type: String },
  api_key: { type: String },
  secret: { type: String },
  user: {
    user_name: { type: String, require: true },
    user_id: { type: String, require: true }
  },
  base_currency: { type: String },
  target_currency: { type: String },
  candle_size: { type: String },
  sellForIndicator: { type: Boolean },
  profit: { type: Number },
  stop: { type: Number },
  strategy: {
    indicators: {
      ema: {
        status: { type: Boolean },
        period: { type: Number }
      },
      macd: {
        status: { type: Boolean },
        shortPeriod: { type: Number },
        longPeriod: { type: Number },
        signalPeriod: { type: Number }
      },
      rsi: {
        status: { type: Boolean },
        period: { type: Number }
      }
    }
  }
})

module.exports = mongoose.model('backtest-configuracao', backtestConfiguracao, 'backtest-configuracao')
