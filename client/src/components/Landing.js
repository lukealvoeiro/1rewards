import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import * as actions from "../actions";
import SquareLoyalty from "./SquareLoyalty";
import { Card, CardContent, makeStyles } from "@material-ui/core";
import CheckoutPage from "./CheckoutPage/CheckoutPage";
import CreateOrder from "./CreateOrder";

const useStyles = makeStyles((theme) => ({
  paymentForm: {
    marginTop: theme.spacing(2),
  },
}));

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

  const classes = useStyles();
  const content = () => {
    if (auth.user.loyaltyProgram && orderId) return <CheckoutPage />;
    else if (auth.user.loyaltyProgram) return <CreateOrder />;
    return <SquareLoyalty />;
  };

  return (
    <Card className={classes.paymentForm}>
      <CardContent>{content()}</CardContent>
    </Card>
  );
};

function mapStateToProps(state) {
  return { auth: state.auth };
}

export default compose(withRouter, connect(mapStateToProps, actions))(Landing);
