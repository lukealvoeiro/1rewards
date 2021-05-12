import { combineReducers } from "redux";

import authReducer from "./authReducers";
import transactionReducer from "./transactionReducers";

export default combineReducers({
  auth: authReducer,
  transaction: transactionReducer,
});
