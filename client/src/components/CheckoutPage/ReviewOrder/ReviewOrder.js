import React from "react";
import { useFormikContext } from "formik";
import { Typography } from "@material-ui/core";
import ProductDetails from "./ProductDetails";
import ShippingDetails from "./ShippingDetails";

export default function ReviewOrder() {
  const { values: formValues } = useFormikContext();
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      <ProductDetails />
      <ShippingDetails formValues={formValues} />
    </React.Fragment>
  );
}
