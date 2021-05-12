import React from "react";
import { Typography, Grid } from "@material-ui/core";
import useStyles from "./styles";

function PaymentDetails(props) {
  const { formValues } = props;
  const classes = useStyles();
  const { firstName, lastName, email, phoneNumber } = formValues;
  return (
    <Grid item xs={12} sm={6}>
      <Typography variant="h6" gutterBottom className={classes.title}>
        Customer Information
      </Typography>
      <Typography
        variant="body2"
        gutterBottom
      >{`${firstName} ${lastName}`}</Typography>
      <Typography variant="body2" gutterBottom>{`${email}`}</Typography>
      <Typography variant="body2" gutterBottom>{`${phoneNumber}`}</Typography>
    </Grid>
  );
}

export default PaymentDetails;
