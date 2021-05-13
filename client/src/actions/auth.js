import axios from "axios";
import {
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT_USER,
  LOYALTY_PROGRAM_RECEIVED,
  ORDER_LOADED,
  DISCOUNT_APPLIED,
  ORDER_PAYED,
  PAY_ERROR,
} from "./types";

export const fetchUser = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/current_user");
    if (res.data) {
      dispatch({ type: USER_LOADED, payload: res.data });
    } else {
      dispatch({ type: AUTH_ERROR });
    }
  } catch (error) {
    dispatch({ type: AUTH_ERROR });
  }
};

export const logoutUser = () => async (dispatch) => {
  await axios.get("/api/logout");
  dispatch({ type: LOGOUT_USER });
};

export const fetchLoyaltyProgram = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/loyalty-program");
    if (res.status === 200) {
      dispatch({ type: LOYALTY_PROGRAM_RECEIVED, payload: res.data });
    }
  } catch (err) {
    dispatch({ type: AUTH_ERROR });
  }
};

export const fetchOrder = (orderId) => async (dispatch) => {
  try {
    const res = await axios.get("/api/retrieve-order", {
      params: { orderId: orderId },
    });
    dispatch({ type: ORDER_LOADED, payload: res.data });
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

export const applyDiscount = (discount) => (dispatch) => {
  discount.amount = 1000;
  discount.applied = true;
  dispatch({ type: DISCOUNT_APPLIED, payload: discount });
};

export const payOrder = (paymentBody) => async (dispatch) => {
  try {
    const res = await axios.post("/api/process-payment", paymentBody);
    if (res.status === 200) {
      dispatch({ type: ORDER_PAYED, payload: res.data });
    }
  } catch (error) {
    dispatch({ type: PAY_ERROR });
  }
};
