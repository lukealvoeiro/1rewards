const JSONBig = require("json-bigint");
const { Client, Environment, ApiError } = require("square");
const { uuidv4 } = require("../utils/squareUtils");

module.exports = (app) => {
  app.post("/api/process-payment", async (req, res) => {
    const requestParams = req.body;
    const client = new Client({
      environment: Environment.Sandbox,
      accessToken: requestParams.accessToken,
    });
    const paymentsApi = client.paymentsApi;
    const requestBody = {
      sourceId: requestParams.nonce,
      amountMoney: {
        amount: requestParams.amount, // $1.00 charge
        currency: "USD",
      },
      idempotencyKey: uuidv4(),
    };
    try {
      const response = await paymentsApi.createPayment(requestBody);
      res.status(200).json({
        title: "Payment Successful",
        result: JSONBig.parse(JSONBig.stringify(response.result)),
      });
    } catch (error) {
      let errorResult = null;
      if (error instanceof ApiError) {
        errorResult = error.errors;
      } else {
        errorResult = error;
      }
      res.status(500).json({
        title: "Payment Failure",
        result: errorResult,
      });
    }
  });
};
