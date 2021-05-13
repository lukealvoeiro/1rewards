import React from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@material-ui/core";
import useStyles from "./styles";
import { connect } from "react-redux";
import legiblePrice from "../../../utils/money";

function ProductDetails({ order, discount }) {
  const classes = useStyles();
  if (!order) {
    return <CircularProgress />;
  }
  return (
    <List disablePadding>
      {order.lineItems.map((product) => (
        <ListItem className={classes.listItem} key={product.name}>
          <ListItemText primary={product.name} secondary={product.desc} />
          <Typography variant="body2">
            {legiblePrice(product.totalMoney.amount)}
          </Typography>
        </ListItem>
      ))}
      {discount ? (
        <ListItem className={classes.listItem}>
          <ListItemText>
            <i>Loyalty Discount</i>
          </ListItemText>
          <Typography variant="body2">
            <i>-{legiblePrice(discount)}</i>
          </Typography>
        </ListItem>
      ) : null}
      <ListItem className={classes.listItem}>
        <ListItemText>
          <b>Total</b>
        </ListItemText>
        <Typography variant="subtitle1" className={classes.total}>
          {legiblePrice(Math.max(order.totalMoney.amount - discount, 0))}
        </Typography>
      </ListItem>
    </List>
  );
}

function mapStateToProps(state) {
  return {
    order: state.transaction.order,
    discount: state.transaction.discount,
  };
}

export default connect(mapStateToProps, null)(ProductDetails);
