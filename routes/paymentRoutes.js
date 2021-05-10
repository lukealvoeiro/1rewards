const JSONBig = require("json-bigint");
const { Client, Environment, ApiError } = require("square");
const { uuidv4, getLocationId } = require("../utils/squareUtils");
const _ = require("lodash");

module.exports = (app) => {
  app.post("/api/process-payment", async (req, res) => {
    const requestParams = req.body;
    const client = new Client({
      environment: Environment.Sandbox,
      accessToken: requestParams.accessToken,
    });
    const paymentsApi = client.paymentsApi;
    const loyaltyApi = client.loyaltyApi;

    // look up phone number to see if customer has a loyalty account
    let {
      result,
      ...httpResponse
    } = await client.loyaltyApi.searchLoyaltyAccounts({
      query: {
        mappings: [
          {
            phoneNumber: requestParams.phoneNumber,
          },
        ],
      },
    });

    // if no loyalty account, create one for this customer
    let customerLoyaltyAccountId;
    if (_.isEmpty(result)) {
      const createLoyaltyAccountBody = {
        loyaltyAccount: {
          mapping: {
            phoneNumber: requestParams.phoneNumber,
          },
          programId: req.user.loyaltyProgram,
        },
        idempotencyKey: uuidv4(),
      };
      try {
        let { result } = await loyaltyApi.createLoyaltyAccount(
          createLoyaltyAccountBody
        );
        customerLoyaltyAccountId = result.loyaltyAccount.id;
      } catch (error) {
        let errorResult = null;
        if (error instanceof ApiError) {
          errorResult = error.errors;
        } else {
          errorResult = error;
        }
        res.status(500).json({
          title: "Failure setting up new loyalty account",
          error: errorResult,
        });
      }
    } else {
      customerLoyaltyAccountId = result.loyaltyAccounts[0].id;
    }

    const paymentRequestBody = {
      sourceId: requestParams.nonce,
      amountMoney: {
        amount: requestParams.amount,
        currency: "USD",
      },
      idempotencyKey: uuidv4(),
    };
    try {
      const paymentResponse = await client.paymentsApi.createPayment(
        paymentRequestBody
      );
      // add loyalty points to user
      const locationId = await getLocationId(client);
      console.log(locationId);
      const loyaltyResponse = await client.loyaltyApi.accumulateLoyaltyPoints(
        customerLoyaltyAccountId,
        {
          accumulatePoints: {
            orderId: requestParams.orderId,
          },
          idempotencyKey: uuidv4(),
          locationId: locationId,
        }
      );
      // console.log(loyaltyResponse.result);
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
        title: "Payment Failure",
        error: errorResult,
      });
    }
  });
};
