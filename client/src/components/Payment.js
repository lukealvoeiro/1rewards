import React, { useState } from "react";
import Input from "react-phone-number-input/input";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import * as actions from "../actions";
import SquarePay from "./SquarePay";
import SquareLoyalty from "./SquareLoyalty";

const Payment = ({ auth, location }) => {
  const [price, setPrice] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState();
  let orderId = localStorage.getItem("order_id");
  if (orderId) {
    localStorage.removeItem("order_id");
  } else {
    orderId = new URLSearchParams(location.search).get("order_id");
  }

  const paymentForm = (
    <React.Fragment>
      <form>
        <h4>How much should the user pay:</h4>
        Price USD:
        <input
          type="number"
          placeholder={"Enter text here"}
          value={price}
          onChange={(e) => setPrice(parseInt(e.target.value))}
        />
        <br />
        Phone Number:
        <Input country="US" value={phoneNumber} onChange={setPhoneNumber} />
      </form>
      orderId: {orderId}
      <SquarePay price={price} phoneNumber={phoneNumber} orderId={orderId} />
    </React.Fragment>
  );

  return (
    <React.Fragment>
      {auth.user.loyaltyProgram ? paymentForm : <SquareLoyalty />}
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  return { auth: state.auth };
}

export default compose(withRouter, connect(mapStateToProps, actions))(Payment);
