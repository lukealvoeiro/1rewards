import React from "react";
import { Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

function SuccessPage({ balance }) {
  return (
    <React.Fragment>
      <Typography variant="h5" gutterBottom>
        Thank you for your order.
      </Typography>
      <Typography variant="subtitle1">
        Your order number is #2001539. We have emailed your order confirmation.
      </Typography>

      <Typography variant="subtitle1">
        Your balance is now: <b>{balance + " "} points</b>
      </Typography>
      <Typography variant="subtitle2">
        <Link to="/">Back to home</Link>
      </Typography>
    </React.Fragment>
  );
}
function mapStateToProps(state) {
  return {
    balance: state.transaction.balance,
  };
}

export default connect(mapStateToProps, null)(SuccessPage);
