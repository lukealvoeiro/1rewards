import React, { useState } from "react";
import Input from "react-phone-number-input/input";
import { connect } from "react-redux";
import * as actions from "../actions";
import SquarePay from "./SquarePay";
import SquareLoyalty from "./SquareLoyalty";

// TODO: determine if we actually need to mapStateToProps here
const Payment = ({ auth }) => {
  const [price, setPrice] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState();
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
      <SquarePay price={price} phoneNumber={phoneNumber} />
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

export default connect(mapStateToProps, actions)(Payment);
