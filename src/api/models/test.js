const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    msg: {type: String, require: true},
    value: {type: Number, min: 0, require: true},
    text: {type: String, require: true}
})

module.exports = mongoose.model('Test', testSchema)