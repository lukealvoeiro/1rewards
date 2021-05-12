import React, { useState } from "react";
import {
  SquarePaymentForm,
  CreditCardNumberInput,
  CreditCardExpirationDateInput,
  CreditCardPostalCodeInput,
  CreditCardCVVInput,
} from "react-square-payment-form";
import "react-square-payment-form/lib/default.css";
import { connect } from "react-redux";
import * as actions from "../actions";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    border: 0,
    borderRadius: 3,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    color: "white",
    height: 48,
    padding: "0 30px",
  },
});

const SquareFormPayment = (props, { auth }) => {
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
        phoneNumber: "+13312449199",
        orderId: "",
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
    <React.Fragment>
      <SquarePaymentForm
        sandbox={true}
        applicationId="sandbox-sq0idb-cjR4Ao7cPUnAYVGSV8yQ1g"
        locationId="LXVGFJMT61QF1"
        cardNonceResponseReceived={cardNonceResponseReceived}
        createVerificationDetails={createVerificationDetails}
        {...props}
      >
        <fieldset className="sq-fieldset">
          <CreditCardNumberInput />
          <div className="sq-form-third">
            <CreditCardExpirationDateInput />
          </div>

          <div className="sq-form-third">
            <CreditCardPostalCodeInput />
          </div>

          <div className="sq-form-third">
            <CreditCardCVVInput />
          </div>
        </fieldset>
      </SquarePaymentForm>
      <div className="sq-error-message">
        {errorMessages.map((errorMessage) => (
          <li key={`sq-error-${errorMessage}`}>{errorMessage}</li>
        ))}
      </div>
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  return { auth: state.auth };
}

export default connect(mapStateToProps, actions)(SquareFormPayment);
