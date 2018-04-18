const restful = require('node-restful')
const mongoose = restful.mongoose

const testSchema = new mongoose.Schema({
    msg: {type: String, require: true},
    value: {type: Number, min: 0, require: true},
    text: {type: String, require: true}
})

module.exports = restful.model('test',testSchema)