//next indicates middleware is over, and passes the request to the next middleware
module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send("error: 'not logged in'");
  }
  //we dont call next inside the if statement because this exits the middleware chain, a desired effect
  next();
};
