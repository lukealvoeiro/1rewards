import {
  FETCH_USER,
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT_USER,
  LOYALTY_PROGRAM_RECEIVED,
} from "../actions/types";

const initialState = {
  authModal: null,
  isLoading: true,
  isAuthenticated: false,
  user: null,
};

export default function authReducers(state = initialState, action) {
  switch (action.type) {
    case FETCH_USER:
      return action.payload || false; // || used so that if data is empty string, we treat it as false
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
        authModal: null,
      };
    case LOGOUT_USER:
    case AUTH_ERROR:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case LOYALTY_PROGRAM_RECEIVED:
      state.user.loyaltyProgram = action.payload;
      return {
        ...state,
      };
    default:
      return state;
  }
}
