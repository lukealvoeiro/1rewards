import React, { useEffect } from "react";
import PrivateRoute from "./PrivateRoute";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import Landing from "./Landing";
import Welcome from "./Welcome";
import Header from "./Header";
import * as actions from "../actions";
import { Container } from "@material-ui/core";

const App = ({ fetchUser }) => {
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <BrowserRouter>
      <Header />
      <Container>
        <Switch>
          <PrivateRoute exact path="/" component={Landing} />

          <Route exact path="/welcome" component={Welcome} />
        </Switch>
      </Container>
    </BrowserRouter>
  );
};

function mapStateToProps(state) {
  return { auth: state.auth };
}

export default connect(mapStateToProps, actions)(App);
