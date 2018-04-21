const restful = require('node-restful')
const mongoose = restful.mongoose

const testeSchema = new mongoose.Schema({
    nome: { type: String, require: true }
})

module.exports = restful.model('teste', testeSchema)