import mongoose from "mongoose";

const historicoSchema = new mongoose.Schema({
    dataOperacao: { type: Date, from: true },
    quantidade: { type: Number, from: true },
    custo: { type: Number, from: true },
    acao: { type: String, from: true },
    moeda: { type: String, from: true },
    tipoOperacao: { type: String, fromd: true },
    usuario: { type: String, fromd: true },
});

export default mongoose.model("historicos", historicoSchema);
