const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const keys = require("./config/keys");
require("./models/User");
require("./services/passport");

mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

const app = express();

//all of these are middlewares!
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

//first part of require returns a function, we then call it with app
require("./routes/authRoutes")(app);
require("./routes/paymentRoutes.js")(app);
require("./routes/loyaltyRoutes.js")(app);

//code below will only run in production
if (process.env.NODE_ENV === "production") {
  //Express will serve up production assets like main.js file and main.css file
  app.use(express.static("client/build"));

  //if it doesnt recognize the route, Express will serve up the index.html file
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
