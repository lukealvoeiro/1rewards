import React, { useEffect } from "react";
import PrivateRoute from "./PrivateRoute";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import Landing from "./Landing";
import Welcome from "./Welcome";
import Header from "./Header";
import * as actions from "../actions";
import { Container } from "@material-ui/core";
import { Card, CardContent, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paymentForm: {
    marginTop: theme.spacing(2),
  },
}));

const App = ({ fetchUser }) => {
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  const classes = useStyles();
  return (
    <BrowserRouter>
      <Header />
      <Container>
        <Card className={classes.paymentForm}>
          <CardContent>
            <Switch>
              <PrivateRoute exact path="/" component={Landing} />

              <Route exact path="/welcome" component={Welcome} />
            </Switch>
          </CardContent>
        </Card>
      </Container>
    </BrowserRouter>
  );
};

function mapStateToProps(state) {
  return { auth: state.auth };
}

export default connect(mapStateToProps, actions)(App);
