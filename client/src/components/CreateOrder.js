import { Typography } from "@material-ui/core";
import React, { Fragment } from "react";

const CreateOrder = () => {
  return (
    <Fragment>
      <Typography variant="body1" gutterBottom>
        <a href="/api/new-order">Create Sample Order</a>
      </Typography>

      <Typography variant="subtitle1">
        {
          "This is just a demo! IRL sellers would redirect to this page with their order ID (e.g. /?order_id=xyz)"
        }
      </Typography>
    </Fragment>
  );
};

export default CreateOrder;
