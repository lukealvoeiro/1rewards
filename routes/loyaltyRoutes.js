const { Client, Environment, ApiError } = require("square");
const keys = require("../config/keys");
const JSONBig = require("json-bigint");
const {
  getLoyaltyProgram,
  getBuyerLoyaltyAccount,
  createBuyerLoyaltyAccount,
  retrieveLoyaltyProgram,
  uuidv4,
} = require("../utils/squareUtils");
const requireLogin = require("../middlewares/requireLogin");
const mongoose = require("mongoose");
const User = mongoose.model("users");

module.exports = (app) => {
  app.get("/api/loyalty-program", requireLogin, async (req, res) => {
    const accessToken = req.user.accessToken;
    let existingAccount = await User.findOne({ accessToken: accessToken });
    const client = new Client({
      environment: Environment.Sandbox,
      accessToken: accessToken,
    });
    const loyaltyProgramId = await getLoyaltyProgram(client);
    if (loyaltyProgramId) {
      // @ts-ignore
      existingAccount.loyaltyProgram = loyaltyProgramId;
      existingAccount.save();
      res.status(200).json(JSONBig.parse(JSONBig.stringify(loyaltyProgramId)));
    } else {
      res.status(400).json(JSONBig.parse(JSONBig.stringify(loyaltyProgramId)));
    }
  });

  app.get("/api/eligible-rewards", requireLogin, async (req, res) => {
    try {
      const requestParams = req.body;
      const client = new Client({
        environment: Environment.Sandbox,
        accessToken: req.user.accessToken,
      });
      const programId = req.user.loyaltyProgramId;
      let buyerLoyaltyAccount = await getBuyerLoyaltyAccount(
        client,
        requestParams.phoneNumber
      );

      if (!buyerLoyaltyAccount) {
        buyerLoyaltyAccount = await createBuyerLoyaltyAccount(
          client,
          requestParams.phoneNumber,
          req.user.loyaltyProgramId
        );
      }

      const loyaltyProgram = await retrieveLoyaltyProgram(
        client,
        req.user.loyaltyProgramId
      );

      const discountAvailable =
        buyerLoyaltyAccount.balance > loyaltyProgram.reward_tiers[0].points;
      res.status(200).send({
        discountAvailable: discountAvailable,
        rewardTierId: loyaltyProgram.reward_tiers[0].id,
        loyaltyAccountId: buyerLoyaltyAccount.id,
        cost: loyaltyProgram.reward_tiers[0].points,
        balance: buyerLoyaltyAccount.balance,
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

  app.post("/api/create-reward", async (req, res) => {
    try {
      const requestParams = req.body;
      const client = new Client({
        environment: Environment.Sandbox,
        accessToken: req.user.accessToken,
      });
      const { result } = await client.loyaltyApi.createLoyaltyReward({
        reward: {
          loyaltyAccountId: requestParams.loyaltyAccountId,
          rewardTierId: requestParams.rewardTierId,
          orderId: requestParams.orderId,
        },
        idempotencyKey: uuidv4(),
      });
      console.log(result);
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
