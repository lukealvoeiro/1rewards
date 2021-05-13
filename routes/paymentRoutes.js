const JSONBig = require("json-bigint");
const { Client, Environment, ApiError } = require("square");
const {
  uuidv4,
  getLocationId,
  createBuyerLoyaltyAccount,
  getBuyerLoyaltyAccount,
  accumulateLoyaltyPoints,
  createPayment,
  payOrder,
  calculateLoyaltyPoints,
  adjustLoyaltyPoints,
  createLoyaltyReward,
} = require("../utils/squareUtils");
const _ = require("lodash");
const requireLogin = require("../middlewares/requireLogin");
const mongoose = require("mongoose");
const Buyer = mongoose.model("buyers");

module.exports = (app) => {
  app.post("/api/process-payment", requireLogin, async (req, res) => {
    const requestParams = req.body;
    const client = new Client({
      environment: Environment.Sandbox,
      accessToken: requestParams.accessToken,
    });

    try {
      // look up phone number to see if customer has a loyalty account
      let buyer = await Buyer.findOne({
        phoneNumber: requestParams.phoneNumber,
      });

      const buyerLoyaltyAccountId = buyer.loyaltyPrograms.find(
        (obj) => obj.loyaltyProgramId === req.user.loyaltyProgram
      ).accountId;

      // get location id
      const locationId = await getLocationId(client);

      if (requestParams.discount) {
        let newLoyaltyPoints = await adjustLoyaltyPoints(
          client,
          buyerLoyaltyAccountId,
          100
        );
        buyer.balance -= 100;
        buyer = await buyer.save();

        let loyaltyReward = await createLoyaltyReward(
          client,
          buyerLoyaltyAccountId,
          requestParams.rewardTierId,
          requestParams.orderId
        );
      }

      if (requestParams.price > 0) {
        let payment = await createPayment(
          client,
          requestParams.nonce,
          requestParams.price,
          requestParams.orderId
        );
      } else {
        let order = await payOrder(client, requestParams.orderId);
      }

      if (requestParams.price > 0) {
        let loyaltyPoints = await calculateLoyaltyPoints(
          client,
          req.user.loyaltyProgram,
          requestParams.orderId
        );
        // add loyalty points to buyer
        if (loyaltyPoints > 0) {
          buyer.balance += loyaltyPoints;
          buyer = await buyer.save();
        }
      }

      res.status(200).json({
        title: "Payment Successful",
        balance: buyer.balance,
      });
    } catch (error) {
      console.log(error);
      let errorResult = null;
      if (error instanceof ApiError) {
        errorResult = error.errors;
      } else {
        errorResult = error;
      }
      res.status(500).json({
        title: "Failure",
        error: errorResult,
      });
    }
  });
};
