const mongoose = require('mongoose')

const exchangeSchema = new mongoose.Schema({
  nome: { type: String, require: true }
})

module.exports = mongoose.model('exchanges', exchangeSchema)
