const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const keys = require("../config/keys");

var UserSchema = new Schema({
  accessToken: { type: String, required: true },
  numPayments: { type: Number, default: 0 },
  loyaltyProgram: { type: String },
});
let UserModel = mongoose.model("users", UserSchema);

module.exports = UserSchema;
