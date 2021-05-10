const { Client, Environment, ApiError } = require("square");
const keys = require("../config/keys");
const JSONBig = require("json-bigint");
const { getLoyaltyProgram } = require("../utils/squareUtils");
const requireLogin = require("../middlewares/requireLogin");
const mongoose = require("mongoose");
const User = mongoose.model("users");

module.exports = (app) => {
  app.get("/api/loyalty-program", requireLogin, async (req, res) => {
    const accessToken = req.user.accessToken;
    let existingAccount = await User.findOne({ accessToken: accessToken });
    const loyaltyProgram = await getLoyaltyProgram(accessToken);
    console.log(loyaltyProgram);
    if ("result" in loyaltyProgram) {
      existingAccount.loyaltyProgram = loyaltyProgram.result.id;
      existingAccount.save();
      res.status(200).json(JSONBig.parse(JSONBig.stringify(loyaltyProgram)));
    } else {
      console.log();
      res.status(500).json(JSONBig.parse(JSONBig.stringify(loyaltyProgram)));
    }
  });
};
