import axios from "axios";
import {
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT_USER,
  LOYALTY_PROGRAM_RECEIVED,
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
      dispatch({ type: LOYALTY_PROGRAM_RECEIVED, payload: res.data.result.id });
    }
  } catch (err) {
    dispatch({ type: AUTH_ERROR });
  }
};
