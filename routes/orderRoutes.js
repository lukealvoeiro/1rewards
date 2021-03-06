const {
  uuidv4,
  getLocationId,
  retrieveOrder,
} = require("../utils/squareUtils");
const { ApiError, Environment, Client } = require("square");
const requireLogin = require("../middlewares/requireLogin");
const JSONBig = require("json-bigint");
const { request } = require("express");
const _ = require("lodash");

const options = [
  {
    name: "String cheese 🧀",
    quantity: "1",
    basePriceMoney: {
      amount: 500,
      currency: "USD",
    },
  },
  {
    name: "Pizza 🍕",
    quantity: "1",
    basePriceMoney: {
      amount: 2500,
      currency: "USD",
    },
  },
  {
    name: "Boba 🧋",
    quantity: "1",
    basePriceMoney: {
      amount: 800,
      currency: "USD",
    },
  },
  {
    name: "Onigiri 🍙",
    quantity: "1",
    basePriceMoney: {
      amount: 500,
      currency: "USD",
    },
  },
  {
    name: "iPhone 📱",
    quantity: "1",
    basePriceMoney: {
      amount: 99900,
      currency: "USD",
    },
  },
];

module.exports = (app) => {
  app.get("/api/new-order", requireLogin, async (req, res) => {
    const requestParams = req.body;

    try {
      const client = new Client({
        environment: Environment.Sandbox,
        accessToken: req.user.accessToken,
      });

      const locationId = await getLocationId(client);

      const newOrder = {
        order: {
          locationId: locationId,
          customerId: "Q8002G4WPSGNXZJ0F2R723HH6DSXNMG",
          lineItems: _.sampleSize(options, 3),
        },
        idempotencyKey: uuidv4(),
      };
      const newOrderId = await (
        await client.ordersApi.createOrder(newOrder)
      ).result.order.id;
      res.redirect(`/?order_id=${newOrderId}`);
    } catch (err) {
      console.log(err);
    }
  });

  app.get("/api/retrieve-order", requireLogin, async (req, res) => {
    try {
      const requestParams = req.query;
      const client = new Client({
        environment: Environment.Sandbox,
        accessToken: req.user.accessToken,
      });
      const order = await retrieveOrder(client, requestParams.orderId);
      res.status(200).send(JSONBig.parse(JSONBig.stringify(order)));
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
