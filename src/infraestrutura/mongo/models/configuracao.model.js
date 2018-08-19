const mongoose = require('mongoose')

const configuracao = new mongoose.Schema({
  api_key: { type: String, require: true },
  secret: { type: String, require: true },
  usuario: {},
  exchange: {},
  status: { type: String, require: true },
  chave: { type: String, require: true }
})

module.exports = mongoose.model('configuracoes', configuracao)
