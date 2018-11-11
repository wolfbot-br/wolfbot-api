const mongoose = require('mongoose')

const paisSchema = new mongoose.Schema({
    countryName: { type: String, required: true },
    countryInitial: { type: String, required: true },
})

module.exports = mongoose.model('countries', paisSchema)
