const mongoose = require('mongoose')

const configuracao = new mongoose.Schema({
  exchange: { type: String },
  api_key: { type: String },
  secret: { type: String },
  user: {
    user_name: { type: String, require: true },
    user_id: { type: String, require: true }
  },
  status: {
    status_bot: { type: Boolean },
    status_buy: { type: Boolean },
    status_sell: { type: Boolean },
    key: { type: String },
    interval_check: { type: Number }
  },
  base_currency: { type: String },
  target_currency: { type: String },
  candle_size: { type: String },
  strategy: {
    external_signal: {},
    indicators: {
      sma: {
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

module.exports = mongoose.model('configuracao', configuracao, 'configuracao')
