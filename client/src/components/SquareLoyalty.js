import React from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import axios from "axios";

const SquareLoyalty = ({ fetchLoyaltyProgram }) => {
  return (
    <div>
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
