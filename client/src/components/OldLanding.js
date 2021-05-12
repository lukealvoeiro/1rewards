import React, { useState, useEffect, useRef } from "react";
import Input from "react-phone-number-input/input";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import * as actions from "../actions";
import SquarePay from "./SquarePay";
import SquareLoyalty from "./SquareLoyalty";
import {
  Button,
  Card,
  CardContent,
  makeStyles,
  Step,
  StepLabel,
  Stepper,
} from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import axios from "axios";
import CheckoutPage from "./CheckoutPage/CheckoutPage";

const useStyles = makeStyles((theme) => ({
  paymentForm: {
    marginTop: theme.spacing(2),
  },
}));

const Payment = ({ auth, location, fetchOrder }) => {
  const [price, setPrice] = React.useState(null);
  const [phoneNumber, setPhoneNumber] = useState();
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
  const paymentForm = (
    <Card className={classes.paymentForm}>
      <CardContent>
        <CheckoutPage />
        <h4>How much should the user pay:</h4>
        Price USD: {price}
        <br />
        Phone Number:
        <Input country="US" value={phoneNumber} onChange={setPhoneNumber} />
      </CardContent>
      orderId: {orderId}
      {/* <SquarePay price={price} phoneNumber={phoneNumber} orderId={orderId} /> */}
    </Card>
  );

  return (
    <React.Fragment>
      {if (auth.user.loyaltyProgram) {
        return (paymentForm)
      } else {<SquareLoyalty />}}
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  return { auth: state.auth };
}

export default compose(withRouter, connect(mapStateToProps, actions))(Payment);
