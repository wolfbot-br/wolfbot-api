const mongoose = require("mongoose");

const activitiesSchema = new mongoose.Schema(
    {
        user: { type: String, require: true },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("activities", activitiesSchema);
