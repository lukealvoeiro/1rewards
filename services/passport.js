const passport = require("passport");
const mongoose = require("mongoose");
const OAuth2Strategy = require("passport-oauth2");
const keys = require("../config/keys");
const { getLoyaltyProgram } = require("../utils/squareUtils");
const { Environment, Client } = require("square");
const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  "square",
  new OAuth2Strategy(
    {
      authorizationURL: "https://connect.squareupsandbox.com/oauth2/authorize",
      tokenURL: "https://connect.squareupsandbox.com/oauth2/token",
      clientID: keys.sqSandboxAppId,
      clientSecret: keys.sqSandboxAppSecret,
      callbackURL: "/auth/square/callback",
      scope: [
        "LOYALTY_READ",
        "LOYALTY_WRITE",
        "PAYMENTS_WRITE",
        "PAYMENTS_READ",
        "PAYMENTS_WRITE_ADDITIONAL_RECIPIENTS",
        "MERCHANT_PROFILE_WRITE",
        "MERCHANT_PROFILE_READ",
        "ORDERS_WRITE",
        "ORDERS_READ",
      ],
    },
    async function (accessToken, refreshToken, profile, done) {
      const existingAccount = await User.findOne({ accessToken: accessToken });
      if (existingAccount) {
        return done(null, existingAccount);
      }
      const client = new Client({
        environment: Environment.Sandbox,
        accessToken: accessToken,
      });
      let newUser = {
        accessToken: accessToken,
      };
      // const loyaltyProgramId = getLoyaltyProgram(client);
      // if (loyaltyProgramId) newUser.loyaltyProgram = loyaltyProgramId;

      const newAccount = await new User(newUser).save();
      done(null, newAccount);
    }
  )
);
