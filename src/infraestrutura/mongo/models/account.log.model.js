const mongoose = require('mongoose')

const accountLogSchema = new mongoose.Schema({
  usuario: { type: String, require: true },
  hash: { type: String, require: true },
  emailConfirmado: { type: Boolean, require: true },
  dtCriacao: { type: Date, require: true },
  dtExpiracao: { type: Date, default: null },
  dtVerificacao: { type: Date, required: true },
  dtConfirmacao: { type: Date, default: null },
  logTipo: { type: String, default: true },
  pendente: { type: Boolean, default: true }
})

module.exports = mongoose.model('account-logs', accountLogSchema)
