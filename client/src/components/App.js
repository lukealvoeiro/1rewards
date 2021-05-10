import React, { useEffect } from "react";
import PrivateRoute from "./PrivateRoute";
import {
  BrowserRouter,
  Route,
  Switch,
  useLocation,
  Link,
} from "react-router-dom";
import { connect } from "react-redux";
import Payment from "./Payment";
import Welcome from "./Welcome";
import * as actions from "../actions";

const App = ({ fetchUser }) => {
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <BrowserRouter>
      <h1>Header</h1>
      <Switch>
        <PrivateRoute exact path="/" component={Payment} />

        <Route exact path="/welcome" component={Welcome} />
      </Switch>
    </BrowserRouter>
  );
};

function mapStateToProps(state) {
  return { auth: state.auth };
}

export default connect(mapStateToProps, actions)(App);
