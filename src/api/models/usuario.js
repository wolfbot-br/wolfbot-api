const mongoose = require('mongoose');

const usuario = mongoose.Schema({
    nome: {type: String, require: true},
    email: {type: String, require: true},
    senha: {type: String, require: true}
})

module.exports = mongoose.model('Usuario', usuario)