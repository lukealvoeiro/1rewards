import { ORDER_LOADED, DISCOUNT_APPLIED } from "../actions/types";

const initialState = {
  order: null,
  discount: { amount: 0, applied: false },
};

export default function transactionReducers(state = initialState, action) {
  switch (action.type) {
    case ORDER_LOADED:
      return {
        ...state,
        order: action.payload,
      };
    case DISCOUNT_APPLIED:
      console.log(action.payload);
      return {
        ...state,
        discount: action.payload,
      };
    default:
      return state;
  }
}
