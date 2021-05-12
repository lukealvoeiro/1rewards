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

function ProductDetails({ order }) {
  const classes = useStyles();
  if (!order) {
    return <CircularProgress />;
  }
  return (
    <List disablePadding>
      {order.lineItems.map((product) => (
        <ListItem className={classes.listItem} key={product.name}>
          <ListItemText primary={product.name} secondary={product.desc} />
          <Typography variant="body2">${product.totalMoney.amount}</Typography>
        </ListItem>
      ))}
      <ListItem className={classes.listItem}>
        <ListItemText primary="Total" />
        <Typography variant="subtitle1" className={classes.total}>
          ${order.totalMoney.amount}
        </Typography>
      </ListItem>
    </List>
  );
}

function mapStateToProps(state) {
  return { order: state.transaction.order };
}

export default connect(mapStateToProps, null)(ProductDetails);
