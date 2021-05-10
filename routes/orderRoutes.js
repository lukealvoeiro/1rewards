const { uuidv4, getLocationId } = require("../utils/squareUtils");
const { ApiError, Environment, Client } = require("square");
const requireLogin = require("../middlewares/requireLogin");

module.exports = (app) => {
  app.get("/api/new-order", requireLogin, async (req, res) => {
    const requestParams = req.body;

    try {
      const client = new Client({
        environment: Environment.Sandbox,
        accessToken: req.user.accessToken,
      });

      const locationId = await getLocationId(client);

      const ordersApi = client.ordersApi;
      const newOrder = {
        order: {
          locationId: locationId,
          customerId: "Q8002G4WPSGNXZJ0F2R723HH6DSXNMG",
          lineItems: [
            {
              name: "String cheese",
              quantity: "1",
              basePriceMoney: {
                amount: 20,
                currency: "USD",
              },
            },
          ],
        },
        idempotencyKey: uuidv4(),
      };
      const newOrderId = await (await ordersApi.createOrder(newOrder)).result
        .order.id;
      res.redirect(`/?order_id=${newOrderId}`);
    } catch (err) {
      console.log(err);
    }
  });
};
