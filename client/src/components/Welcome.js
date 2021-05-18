import { Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";

const Welcome = ({ location }) => {
  const signUp = () => {
    const orderId = new URLSearchParams(location.search).get("order_id");
    if (orderId) {
      window.localStorage.setItem("order_id", orderId);
      console.log(orderId);
    }
  };

  return (
    <Fragment>
      <Typography variant="body1" gutterBottom>
        <a href="/auth/square" onClick={() => signUp()}>
          Authorize your app!
        </a>
      </Typography>
      <Typography variant="subtitle1">
        {
          "1Rewards requires authorization from Square to take payments for you."
        }
      </Typography>
    </Fragment>
  );
};

export default withRouter(Welcome);
