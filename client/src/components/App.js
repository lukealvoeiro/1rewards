import React, { useEffect } from "react";
import PrivateRoute from "./PrivateRoute";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { connect } from "react-redux";
import Payment from "./Payment";
import * as actions from "../actions";

const Welcome = () => {
  return <Link to="/auth/square">Welcome</Link>;
};

const App = ({ fetchUser }) => {
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <BrowserRouter>
      <h1>Header</h1>
      <Switch>
        <PrivateRoute exact path="/" component={Payment} />
        <Route path="/welcome" component={Welcome} />
      </Switch>
    </BrowserRouter>
  );
};

function mapStateToProps(state) {
  return { auth: state.auth };
}

export default connect(mapStateToProps, actions)(App);
