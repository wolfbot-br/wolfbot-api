const mongoose = require("mongoose");

const accountLogSchema = new mongoose.Schema(
    {
        user: { type: String, require: true },
        verifiedEmail: { type: Boolean, require: true },
        expirationDate: { type: Date, default: null },
        verificationDate: { type: Date, fromd: true },
        logType: { type: String, default: true },
        pending: { type: Boolean, default: true },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("accounts-logs", accountLogSchema);
