const mongoose = require('mongoose');

let teste = new mongoose.Schema({
    msg: {type: String, require: true},
    value: {type: Number, min: 0, require: true},
    text: {type: String, require: true}
})

module.exports = mongoose.model('Teste', teste)