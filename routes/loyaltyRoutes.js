const { Client, Environment, ApiError } = require("square");
const keys = require("../config/keys");
const JSONBig = require("json-bigint");

module.exports = (app) => {
  app.get("/api/loyalty-program", async (req, res) => {
    const user = req.user;
    const client = new Client({
      environment: Environment.Sandbox,
      accessToken: user.accessToken,
    });
    try {
      const { result } = await client.loyaltyApi.retrieveLoyaltyProgram("main");
      console.log(result.program);
      res.status(200).json(JSONBig.parse(JSONBig.stringify(result.program)));
    } catch (error) {
      let errorResult = null;
      if (error instanceof ApiError) {
        errorResult = error.errors;
      } else {
        errorResult = error;
      }
      console.log(errorResult);
      res.status(500).json({
        title: "Failed to get loyalty program",
        result: errorResult,
      });
    }
  });
};
