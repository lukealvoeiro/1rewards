import { Button, Typography } from "@material-ui/core";
import { useFormikContext } from "formik";
import React, { useEffect } from "react";
import axios from "axios";
import ProductDetails from "./ProductDetails";
import ShippingDetails from "./ShippingDetails";
import DiscountDialog from "../../DiscountDialog";
import * as actions from "../../../actions";
import { connect } from "react-redux";

function ReviewOrder({ applyDiscount }) {
  const { values: formValues } = useFormikContext();

  const [open, setOpen] = React.useState(false);
  const [discounts, setDiscounts] = React.useState({});

  useEffect(() => {
    async function fetchDiscounts() {
      const res = await axios.get("/api/eligible-rewards", {
        params: { phoneNumber: formValues.phoneNumber },
      });
      if (res.status === 200) setDiscounts(res.data);
    }
    fetchDiscounts();
  }, [formValues.phoneNumber]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDiscount = () => {
    setOpen(false);
    applyDiscount(1000);
  };

  function _renderDiscountButton() {
    if (false && (!discounts || !discounts.discountAvailable)) {
      return null;
    } else {
      return (
        <Button
          onClick={() => {
            handleClickOpen();
          }}
        >
          View available discounts
        </Button>
      );
    }
  }

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      <ProductDetails />
      {_renderDiscountButton()}
      <DiscountDialog
        open={open}
        handleClose={handleClose}
        discounts={discounts}
        handleDiscount={handleDiscount}
      />
      <ShippingDetails formValues={formValues} />
    </React.Fragment>
  );
}

export default connect(null, actions)(ReviewOrder);
