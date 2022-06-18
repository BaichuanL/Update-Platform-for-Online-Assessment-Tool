const jwt = require("jsonwebtoken");
const User = require("./models/userModel");

const auth = async (req, res, next) => {
  try {
    const token = req.signedCookies.token;
    if(req.route.path == "/" && !token){
      req.isLoggedIn = false;
      next();
      return;
    }
    if(!token){
      throw new Error();
    }
    const decoded = jwt.verify(token, "1234567890");
    const user = await User.findOne({ _id: decoded._id });
    if(req.route.path == "/" && !user){
      req.isLoggedIn = false;
      next();
    }
    else if (!user) {
      throw new Error();
    } else {
      req.isLoggedIn = true;
      req.userId = user._id;
      next();
    }
  } catch (e) {
    res.render("pages/login", {
      page: "login",
      menuId: "login",
      isLoggedIn: false,
      error: ""
    });
  }
};

module.exports = auth;
