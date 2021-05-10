const { Client, Environment, ApiError } = require("square");
const keys = require("../config/keys");

const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const getLoyaltyProgram = async (accessToken) => {
  const client = new Client({
    environment: Environment.Sandbox,
    accessToken: accessToken,
  });
  try {
    const { result } = await client.loyaltyApi.retrieveLoyaltyProgram("main");
    return {
      title: "Successfully retrieved seller's loyalty program",
      result: result.program,
    };
  } catch (error) {
    let errorResult = null;
    if (error instanceof ApiError) {
      errorResult = error.errors;
    } else {
      errorResult = error;
    }
    return {
      title: "Failed to get loyalty program",
      error: errorResult,
    };
  }
};

const getLocationId = async (client) => {
  let { result } = await client.locationsApi.listLocations();
  const locationId = result.locations[0].id;
  return locationId;
};

exports = module.exports = { uuidv4, getLoyaltyProgram, getLocationId };
