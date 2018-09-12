const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    date: { type: Date, require: true },
    amount: { type: Number, require: true },
    price: { type: Number, require: true },
    action: { type: String, require: true },
    currency: { type: String, require: true },
    type_order: { type: String, required: true },
    type_operation: { type: String, required: true },
    user: { type: String, required: true },
    identifier: { type: String, required: true }
})

module.exports = mongoose.model('order', orderSchema)
