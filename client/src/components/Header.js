import React from "react";
import { connect } from "react-redux";
import {
  AppBar,
  Button,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import * as actions from "../actions";

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(3),
    padding: theme.spacing(3),
  },
  title: {
    flexGrow: 1,
  },
  root: {
    flexGrow: 1,
  },
}));

const Header = ({ auth, logoutUser }) => {
  const classes = useStyles();
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h5" className={classes.title}>
          1Rewards
        </Typography>
        {auth.isAuthenticated ? (
          <Button color="inherit" onClick={logoutUser}>
            Logout
          </Button>
        ) : null}
      </Toolbar>
    </AppBar>
  );
};

function mapStateToProps(state) {
  return { auth: state.auth };
}

export default connect(mapStateToProps, actions)(Header);
