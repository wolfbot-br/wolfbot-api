const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, require: true },
        password: { type: String, require: true, select: true, min: 6, max: 12 },
        email: { type: String, unique: true, require: true, lowercase: true },
        phone: { type: Number, require: false },
        uid: { type: String, required: true },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("usuario", userSchema);
