const passport = require("passport");
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users");

module.exports = (app) => {
  app.get("/auth/square", passport.authenticate("square"));

  app.get(
    "/auth/square/callback",
    passport.authenticate("square"),
    (req, res) => {
      res.redirect("/");
    }
  );

  app.get("/api/current_user", (req, res) => {
    res.send(req.user);
  });

  app.get("/api/logout", (req, res) => {
    req.logout();
    res.send(req.user);
  });
};
