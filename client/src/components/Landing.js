import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import * as actions from "../actions";
import SquareLoyalty from "./SquareLoyalty";
import CheckoutPage from "./CheckoutPage/CheckoutPage";
import CreateOrder from "./CreateOrder";

const Landing = ({ auth, location, fetchOrder }) => {
  let orderId = localStorage.getItem("order_id");
  if (orderId) {
    localStorage.removeItem("order_id");
  } else {
    orderId = new URLSearchParams(location.search).get("order_id");
  }

  useEffect(() => {
    fetchOrder(orderId);
  }, [fetchOrder, orderId]);

  const content = () => {
    if (auth.user.loyaltyProgram && orderId) return <CheckoutPage />;
    else if (auth.user.loyaltyProgram) return <CreateOrder />;
    return <SquareLoyalty />;
  };

  return content();
};

function mapStateToProps(state) {
  return { auth: state.auth };
}

export default compose(withRouter, connect(mapStateToProps, actions))(Landing);
