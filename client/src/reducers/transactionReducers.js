import {
  ORDER_LOADED,
  DISCOUNT_APPLIED,
  ORDER_PAYED,
  PAY_ERROR,
} from "../actions/types";

const initialState = {
  order: null,
  discount: { amount: 0, applied: false },
  paymentError: false,
  fulfilled: false,
  balance: 0,
};

export default function transactionReducers(state = initialState, action) {
  switch (action.type) {
    case ORDER_LOADED:
      return {
        ...state,
        order: action.payload,
      };
    case DISCOUNT_APPLIED:
      return {
        ...state,
        discount: action.payload,
      };
    case ORDER_PAYED:
      return {
        ...state,
        fulfilled: true,
        balance: action.payload.balance,
      };
    case PAY_ERROR:
      return {
        ...state,
        paymentError: true,
      };
    default:
      return state;
  }
}
