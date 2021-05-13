import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";

const DiscountDialog = ({ open, handleClose, handleDiscount, discounts }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Use discount?"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DialogContentText id="alert-dialog-description">
              Your current balance is: <b>{discounts.balance} points</b>
            </DialogContentText>
            <TableContainer component={Paper}>
              <Table size="small" aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>Discount Type</b>
                    </TableCell>
                    <TableCell align="right">
                      <b>{"Cost (points)"}</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {discounts.description}
                    </TableCell>
                    <TableCell align="right">{discounts.cost}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDiscount} color="primary" autoFocus>
          Use
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DiscountDialog;
