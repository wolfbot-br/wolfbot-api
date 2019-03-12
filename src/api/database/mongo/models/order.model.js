import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    date: { type: String, from: true },
    amount: { type: Number, from: true },
    price: { type: Number, from: true },
    cost: { type: Number, from: true },
    currency: { type: String, from: true },
    type_operation: { type: String, fromd: true },
    action: { type: String, from: true },
    user: { type: String, fromd: true },
    identifier: { type: String, fromd: true },
    status: { type: String, from: true },
});

export default mongoose.model("order", orderSchema);
