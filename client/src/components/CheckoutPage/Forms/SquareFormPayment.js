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
import * as actions from "../../../actions";
import axios from "axios";
import { PaymentButton } from "../../FormControls";
import legiblePrice from "../../../utils/money";
import { useFormikContext } from "formik";

const SquareFormPayment = ({ auth, order, discount }) => {
  const [errorMessages, setErrorMessages] = useState([]);
  const price = order.totalMoney.amount > 0 ? order.totalMoney.amount : 0;
  const { values: formValues } = useFormikContext();
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
        phoneNumber: formValues.phoneNumber,
        orderId: order.id,
        price: price,
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
    <div style={{ maxWidth: "380px", margin: "auto" }}>
      <SquarePaymentForm
        sandbox={true}
        applicationId="sandbox-sq0idb-cjR4Ao7cPUnAYVGSV8yQ1g"
        locationId="LXVGFJMT61QF1"
        cardNonceResponseReceived={cardNonceResponseReceived}
        createVerificationDetails={createVerificationDetails}
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
        <PaymentButton
          price={legiblePrice(Math.max(order.totalMoney.amount - discount, 0))}
        />
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
  return {
    auth: state.auth,
    order: state.transaction.order,
    discount: state.transaction.discount,
  };
}

export default connect(mapStateToProps, actions)(SquareFormPayment);
