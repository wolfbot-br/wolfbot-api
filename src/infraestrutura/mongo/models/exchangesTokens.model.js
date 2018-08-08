const mongoose = require('mongoose');

const eschangeTokensSchema = new mongoose.Schema({
    api_key: { type: String, require: true },
    secret: { type: String, require: true },
    usuario: {},
    exchange: {},
    status: { type: String, require: true }
});

module.exports = mongoose.model('exchanges_tokens', eschangeTokensSchema); 