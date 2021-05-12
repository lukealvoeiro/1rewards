const JSONBig = require("json-bigint");
const { Client, Environment, ApiError } = require("square");
const {
  uuidv4,
  getLocationId,
  createBuyerLoyaltyAccount,
  getBuyerLoyaltyAccount,
  accumulateLoyaltyPoints,
} = require("../utils/squareUtils");
const _ = require("lodash");
const requireLogin = require("../middlewares/requireLogin");

module.exports = (app) => {
  app.post("/api/process-payment", requireLogin, async (req, res) => {
    const requestParams = req.body;
    console.log("requestParams --> ", requestParams);
    const client = new Client({
      environment: Environment.Sandbox,
      accessToken: requestParams.accessToken,
    });

    try {
      // look up phone number to see if customer has a loyalty account
      let buyerLoyaltyAccount = await getBuyerLoyaltyAccount(
        client,
        requestParams.phoneNumber
      );

      // TODO: pay for order, only if it is > 0.
      // create payment
      const paymentRequestBody = {
        sourceId: requestParams.nonce,
        amountMoney: {
          amount: requestParams.amount,
          currency: "USD",
        },
        idempotencyKey: uuidv4(),
      };
      const paymentResponse = await client.paymentsApi.createPayment(
        paymentRequestBody
      );

      // get location id
      const locationId = await getLocationId(client);
      console.log(locationId);

      // add loyalty points to user
      const accumulated = await accumulateLoyaltyPoints(
        client,
        requestParams.orderId,
        locationId,
        buyerLoyaltyAccount.id
      );
      console.log(accumulated);

      res.status(200).json({
        title: "Payment Successful",
        result: JSONBig.parse(JSONBig.stringify(paymentResponse.result)),
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
