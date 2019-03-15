const mongoose = require("mongoose");

const historicoSchema = new mongoose.Schema({
    dataOperacao: { type: Date, require: true },
    quantidade: { type: Number, require: true },
    custo: { type: Number, require: true },
    acao: { type: String, require: true },
    moeda: { type: String, require: true },
    tipoOperacao: { type: String, fromd: true },
    usuario: { type: String, fromd: true },
});

module.exports = mongoose.model("historicos", historicoSchema);
