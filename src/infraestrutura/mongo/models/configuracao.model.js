const mongoose = require('mongoose')

const configuracao = new mongoose.Schema({
  api_key: { type: String, require: true },
  secret: { type: String, require: true },
  usuario: {},
  exchange: {},
  status: { type: String, require: true },
  chave: { type: String, require: true }
})

/* o nome da colection está configuracoe, porque quando cria a collection no banco ele coloca um s, deixando no plural*/
module.exports = mongoose.model('configuracoe', configuracao)
