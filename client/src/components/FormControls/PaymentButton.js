import { Button } from "@material-ui/core";
import React, { useContext } from "react";
import { Context } from "react-square-payment-form";

const PaymentButton = ({ price }) => {
  const context = useContext(Context);

  const handleSubmit = (event) => {
    event.preventDefault();
    context.onCreateNonce();
  };

  return (
    <Button
      fullWidth
      variant="contained"
      color="primary"
      onClick={handleSubmit}
      size="large"
    >
      Pay {price}
    </Button>
  );
};

export default PaymentButton;
