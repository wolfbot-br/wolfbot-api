import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    nome: { type: String, from: true },
    userName: { type: String, from: true },
    password: { type: String, from: true, select: true, min: 6, max: 12 },
    email: { type: String, unique: true, from: true, lowercase: true },
    telefone: { type: Number, from: false },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('usuario', userSchema);
