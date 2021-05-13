const { Client, Environment, ApiError } = require("square");
const keys = require("../config/keys");

const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const getLoyaltyProgram = async (client) => {
  const { result } = await client.loyaltyApi.retrieveLoyaltyProgram("main");
  return result.program.id;
};

const getBuyerLoyaltyAccount = async (client, phoneNumber) => {
  let { result } = await client.loyaltyApi.searchLoyaltyAccounts({
    query: {
      mappings: [
        {
          phoneNumber: phoneNumber,
        },
      ],
    },
  });
  return result.loyaltyAccounts ? result.loyaltyAccounts[0] : null;
};

const createBuyerLoyaltyAccount = async (
  client,
  phoneNumber,
  loyaltyProgramId
) => {
  let { result } = await client.loyaltyApi.createLoyaltyAccount({
    loyaltyAccount: {
      mapping: {
        phoneNumber: phoneNumber,
      },
      programId: loyaltyProgramId,
    },
    idempotencyKey: uuidv4(),
  });
  return result.loyaltyAccount;
};

const getLocationId = async (client) => {
  let { result } = await client.locationsApi.listLocations();
  const locationId = result.locations[0].id;
  return locationId;
};

const accumulateLoyaltyPoints = async (
  client,
  orderId,
  locationId,
  buyerLoyaltyAccountId
) => {
  console.log(orderId);
  const { result } = await client.loyaltyApi.accumulateLoyaltyPoints(
    buyerLoyaltyAccountId,
    {
      accumulatePoints: {
        orderId: orderId,
      },
      idempotencyKey: uuidv4(),
      locationId: locationId,
    }
  );
  return result.program;
};

const retrieveLoyaltyProgram = async (client, loyaltyProgramId) => {
  const { result } = await client.loyaltyApi.retrieveLoyaltyProgram(
    loyaltyProgramId
  );
  return result.program;
};

const retrieveLoyaltyAccount = async (client, loyaltyAccountId) => {
  const { result } = await client.loyaltyApi.retrieveLoyaltyAccount(
    loyaltyAccountId
  );
  return result;
};

const retrieveOrder = async (client, orderId) => {
  const { result } = await client.ordersApi.retrieveOrder(orderId);
  return result.order;
};

exports = module.exports = {
  uuidv4,
  getLocationId,
  getLoyaltyProgram,
  createBuyerLoyaltyAccount,
  getBuyerLoyaltyAccount,
  accumulateLoyaltyPoints,
  retrieveLoyaltyProgram,
  retrieveOrder,
  retrieveLoyaltyAccount,
};
