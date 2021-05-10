import React from "react";
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
    <a href="/auth/square" onClick={() => signUp()}>
      Authorize your app!
    </a>
  );
};

export default withRouter(Welcome);
