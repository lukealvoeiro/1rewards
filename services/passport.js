const passport = require("passport");
const mongoose = require("mongoose");
const OAuth2Strategy = require("passport-oauth2");
const keys = require("../config/keys");

const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  done(null, user._id);
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
      ],
    },
    async function (accessToken, refreshToken, profile, done) {
      const existingAccount = await User.findOne({ accessToken: accessToken });
      if (existingAccount) {
        return done(null, existingAccount);
      }
      const newAccount = await new User({ accessToken: accessToken }).save();
      done(null, newAccount);
    }
  )
);
