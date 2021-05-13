import { Button } from "@material-ui/core";
import React, { useContext } from "react";
import { Context } from "react-square-payment-form";

const PaymentButton = ({ price, loading }) => {
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
      disabled={loading}
    >
      Pay {price}
    </Button>
  );
};

export default PaymentButton;
