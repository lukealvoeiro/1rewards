import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { InputField } from "../../FormControls";

export default function AddressForm(props) {
  const {
    formField: { firstName, lastName, email, phoneNumber },
  } = props;

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Customer Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <InputField name={firstName.name} label={firstName.label} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputField name={lastName.name} label={lastName.label} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <InputField name={email.name} label={email.label} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <InputField
            name={phoneNumber.name}
            label={phoneNumber.label}
            fullWidth
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
