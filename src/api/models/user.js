const restful = require('node-restful')
const mongoose = restful.mongoose

const userSchema = new mongoose.Schema({
    nome: { type: String, require: true },
    userName: { type: String, require: true },
    password: { type: String, require: true, select: false },
    email: { type: String, unique: true, require: true, lowercase: true },
    telefone: { type: Number, require: false },
    createdAt: {type: Date, default: Date.now}
})

module.exports = restful.model('user', userSchema)