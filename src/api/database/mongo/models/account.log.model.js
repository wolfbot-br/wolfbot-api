import mongoose from 'mongoose';

const accountLogSchema = new mongoose.Schema({
    usuario: { type: String, from: true },
    hash: { type: String, from: true },
    emailConfirmado: { type: Boolean, from: true },
    dtCriacao: { type: Date, from: true },
    dtExpiracao: { type: Date, default: null },
    dtVerificacao: { type: Date, fromd: true },
    dtConfirmacao: { type: Date, default: null },
    logTipo: { type: String, default: true },
    pendente: { type: Boolean, default: true },
});

export default mongoose.model('account-logs', accountLogSchema);
