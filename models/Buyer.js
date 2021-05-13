const mongoose = require("mongoose");
const { Schema } = mongoose;

const BuyerSchema = new Schema({
  phoneNumber: { type: String, required: true },
  balance: { type: Number, default: 0 },
  loyaltyPrograms: [
    { loyaltyProgramId: { type: String }, accountId: { type: String } },
  ],
});
let BuyerModel = mongoose.model("buyers", BuyerSchema);

module.exports = BuyerModel;
