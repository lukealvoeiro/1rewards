const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  accessToken: { type: String, required: true },
  numPayments: { type: Number, default: 0 },
  loyaltyProgram: { type: String },
});
let UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
