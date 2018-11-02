const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, require: true },
  password: { type: String, require: true, select: true, min: 6, max: 20 },
  email: { type: String, unique: true, require: true, lowercase: true },
  emailVerified: { type: Boolean, required: true, default: false },
  genre: { type: String },
  country: { type: String },
  city: { type: String },
  phoneNumber: { type: String },
  TelephoneNumber: { type: String },
  photo: { type: String }

}, {
    timestamps: true
  })

module.exports = mongoose.model('usuario', userSchema)
