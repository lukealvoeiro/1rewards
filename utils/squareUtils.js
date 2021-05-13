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

const payOrder = async (client, orderId, paymentId = null) => {
  let requestBody = {
    idempotencyKey: uuidv4(),
  };
  if (paymentId) {
    requestBody.paymentIds = [paymentId];
  }
  const { result } = await client.ordersApi.payOrder(orderId, requestBody);
  return result;
};

const createPayment = async (client, nonce, price, orderId) => {
  const paymentRequestBody = {
    sourceId: nonce,
    amountMoney: {
      amount: price,
      currency: "USD",
    },
    orderId: orderId,
    idempotencyKey: uuidv4(),
  };
  const { result } = await client.paymentsApi.createPayment(paymentRequestBody);
  return result.payment;
};

const calculateLoyaltyPoints = async (client, programId, orderId) => {
  const { result } = await client.loyaltyApi.calculateLoyaltyPoints(programId, {
    orderId: orderId,
  });
  return result.points;
};

const adjustLoyaltyPoints = async (client, loyaltyAccountId, points) => {
  const { result } = await client.loyaltyApi.adjustLoyaltyPoints(
    loyaltyAccountId,
    {
      idempotencyKey: uuidv4(),
      adjustPoints: {
        points: points,
      },
    }
  );
  return result;
};

const createLoyaltyReward = async (
  client,
  loyaltyAccountId,
  rewardTierId,
  orderId
) => {
  const { result } = await client.loyaltyApi.createLoyaltyReward({
    reward: {
      loyaltyAccountId: loyaltyAccountId,
      rewardTierId: rewardTierId,
      orderId: orderId,
    },
    idempotencyKey: uuidv4(),
  });
  return result;
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
  payOrder,
  createPayment,
  calculateLoyaltyPoints,
  adjustLoyaltyPoints,
  createLoyaltyReward,
};
