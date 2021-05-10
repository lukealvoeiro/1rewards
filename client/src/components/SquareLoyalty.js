import React from "react";
import { connect } from "react-redux";
import * as actions from "../actions";

const SquareLoyalty = ({ fetchLoyaltyProgram }) => {
  return (
    <div>
      Oops! Seems like you don't have loyalty program registered. Please create
      one through your Square Dashboard. Once done, press the button below!
      <button onClick={() => fetchLoyaltyProgram()}>
        Register Loyalty Program
      </button>
    </div>
  );
};

function mapStateToProps(state) {
  return { auth: state.auth };
}

export default connect(mapStateToProps, actions)(SquareLoyalty);
