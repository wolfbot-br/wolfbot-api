const mongoose = require('mongoose');

const accountLogSchema = new mongoose.Schema({
    usuario: { type: String, require: true },
    hash: { type: String, require: true },
    emailConfirmado: { type: Boolean, require: true },
    dtCriacao: { type: Date, require: true },
    dtConfirmacao: { type: Date, default: null },
    logTipo: { type: String, default: true }
});

module.exports = mongoose.model('account-logs', accountLogSchema);
