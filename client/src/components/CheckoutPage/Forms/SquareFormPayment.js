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

const SquareFormPayment = ({
  auth,
  order,
  discount,
  payOrder,
  advance,
  fulfilled,
}) => {
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const price = Math.max(order.totalMoney.amount - discount.amount, 0);
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
    setPaymentLoading(true);
    await payOrder({
      nonce: nonce,
      buyerVerificationToken: buyerVerificationToken,
      accessToken: auth.user.accessToken,
      phoneNumber: formValues.phoneNumber,
      orderId: order.id,
      price: price,
      discount: discount.applied ? true : false,
      rewardTierId: discount.rewardTierId,
    });
    setPaymentLoading(false);
    advance();
  };

  const createVerificationDetails = (phoneNumber) => {
    return {
      amount: Math.max(order.totalMoney.amount - discount, 0).toString(),
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
        <PaymentButton price={legiblePrice(price)} loading={paymentLoading} />
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
    fulfilled: state.transaction.fulfilled,
  };
}

export default connect(mapStateToProps, actions)(SquareFormPayment);
