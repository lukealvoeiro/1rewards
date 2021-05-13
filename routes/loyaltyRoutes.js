const { Client, Environment, ApiError } = require("square");
const keys = require("../config/keys");
const JSONBig = require("json-bigint");
const {
  getLoyaltyProgram,
  getBuyerLoyaltyAccount,
  createBuyerLoyaltyAccount,
  retrieveLoyaltyProgram,
  uuidv4,
  retrieveLoyaltyAccount,
} = require("../utils/squareUtils");
const requireLogin = require("../middlewares/requireLogin");
const mongoose = require("mongoose");
const Buyer = mongoose.model("buyers");
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
      const requestParams = req.query;
      const client = new Client({
        environment: Environment.Sandbox,
        accessToken: req.user.accessToken,
      });
      const programId = req.user.loyaltyProgram;

      // find buyer with this phone number
      let buyer = await Buyer.findOne({
        phoneNumber: requestParams.phoneNumber,
      });
      // if buyer isn't found, create a new one with this phone number
      if (!buyer) {
        buyer = await new Buyer({
          phoneNumber: requestParams.phoneNumber,
          loyaltyPrograms: [],
        });
      }
      // check if buyer is in this loyalty program
      let thisAccount = buyer.loyaltyPrograms.find(
        (obj) => obj.loyaltyProgramId === programId
      );

      let buyerLoyaltyAccount;
      if (thisAccount) {
        // if buyer in loyalty program, then just retrieve their account
        buyerLoyaltyAccount = await retrieveLoyaltyAccount(
          client,
          thisAccount.accountId
        );
      }
      if (!thisAccount) {
        // if buyer not in loyalty, here is where it gets a bit complicated...
        // ------ SITUATION 1 ------
        // if there is already a loyalty account associated with prior activity,
        // we want to fetch that and then set the balance of the account to the
        // max of the buyer's current balance and what was associated with that
        // loyalty account
        buyerLoyaltyAccount = await getBuyerLoyaltyAccount(
          client,
          requestParams.phoneNumber
        );
        if (buyerLoyaltyAccount) {
          buyer.balance = Math.max(buyerLoyaltyAccount.balance, buyer.balance);
        } else {
          // ------ SITUATION 2 ------
          // buyer is new to this seller, so we just create a brand new loyalty
          // account for them
          buyerLoyaltyAccount = await createBuyerLoyaltyAccount(
            client,
            requestParams.phoneNumber,
            programId
          );
        }

        buyer.loyaltyPrograms.push({
          loyaltyProgramId: programId,
          accountId: buyerLoyaltyAccount.id,
        });
        buyer.save();
      }

      const loyaltyProgram = await retrieveLoyaltyProgram(client, programId);
      const discountAvailable =
        buyer.balance > loyaltyProgram.rewardTiers[0].points;
      res.status(200).send({
        discountAvailable: discountAvailable,
        rewardTierId: loyaltyProgram.rewardTiers[0].id,
        loyaltyAccountId: buyerLoyaltyAccount.id,
        cost: loyaltyProgram.rewardTiers[0].points,
        balance: buyer.balance,
        description: loyaltyProgram.rewardTiers[0].name,
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
