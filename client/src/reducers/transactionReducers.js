import { ORDER_LOADED } from "../actions/types";

const initialState = {
  order: null,
};

export default function transactionReducers(state = initialState, action) {
  switch (action.type) {
    case ORDER_LOADED:
      return {
        ...state,
        order: action.payload,
      };
    default:
      return state;
  }
}
