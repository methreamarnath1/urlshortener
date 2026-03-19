const jwt = require("jsonwebtoken");
async function identifyUser(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "  TOKEN NOT PROVIDED _unauthenticated access",
    });
  }
  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log("Decoded token:", decoded);
  } catch (err) {
    return res.status(401).json({
      message: "invalid token _unauthenticated access",
    });
  }
  req.user = decoded;
  // console.log("User identified:", req.user);
  next();
}

module.exports = {
  identifyUser,
};
