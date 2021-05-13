import { ORDER_LOADED, DISCOUNT_APPLIED } from "../actions/types";

const initialState = {
  order: null,
  discount: 0,
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
    default:
      return state;
  }
}
