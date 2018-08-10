const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  nome: { type: String, require: true },
  userName: { type: String, require: true },
  password: { type: String, require: true, select: true, min: 6, max: 12 },
  email: { type: String, unique: true, require: true, lowercase: true },
  telefone: { type: Number, require: false },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('usuario', userSchema)
