import React, { useState } from "react";
import {
  SimpleCard,
  SquarePaymentForm,
  CreditCardSubmitButton,
} from "react-square-payment-form";
import "react-square-payment-form/lib/default.css";
import { connect } from "react-redux";
import * as actions from "../actions";
import axios from "axios";

const SquarePay = ({ price, auth, phoneNumber }) => {
  const [errorMessages, setErrorMessages] = useState([]);

  const cardNonceResponseReceived = async (
    errors,
    nonce,
    cardData,
    buyerVerificationToken
  ) => {
    if (errors) {
      setErrorMessages(errors.map((error) => error.message));
      return;
    }
    setErrorMessages([]);
    // now send none and buyer verification token to backend
    try {
      const response = await axios.post("/api/process-payment", {
        nonce: nonce,
        buyerVerificationToken: buyerVerificationToken,
        accessToken: auth.user.accessToken,
        amount: price * 100,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const createVerificationDetails = (phoneNumber) => {
    return {
      amount: "100.00",
      currencyCode: "USD",
      intent: "CHARGE",
      billingContact: {
        familyName: "Smith",
        givenName: "John",
        email: "jsmith@example.com",
        country: "GB",
        city: "London",
        addressLines: ["1235 Emperor's Gate"],
        postalCode: "SW7 4JA",
        phone: phoneNumber,
      },
    };
  };

  return (
    <div>
      <SquarePaymentForm
        sandbox={true}
        applicationId={"sandbox-sq0idb-cjR4Ao7cPUnAYVGSV8yQ1g"}
        locationId={"LXVGFJMT61QF1"}
        cardNonceResponseReceived={cardNonceResponseReceived}
        createVerificationDetails={createVerificationDetails}
      >
        <SimpleCard />
        <CreditCardSubmitButton>Pay ${price}.00</CreditCardSubmitButton>
      </SquarePaymentForm>
      <div className="sq-error-message">
        {errorMessages.map((errorMessage) => (
          <li key={`sq-error-${errorMessage}`}>{errorMessage}</li>
        ))}
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return { auth: state.auth };
}

export default connect(mapStateToProps, actions)(SquarePay);
