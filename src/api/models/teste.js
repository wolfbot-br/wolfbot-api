const mongoose = require('mongoose')

const testeSchema = new mongoose.Schema({
    nome: { type: String }
})

module.exports = mongoose.model('teste', testeSchema)