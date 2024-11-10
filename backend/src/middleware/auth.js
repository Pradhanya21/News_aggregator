const jwt = require("jsonwebtoken");
const Auth = require("../models/Auth");

const authUser = (req, res, next) => {
  if (!("authorization" in req.headers)) {
    return res.status(400).json({ status: "error", msg: "no token found" });
  }

  const token = req.headers["authorization"].replace("Bearer ", "");
  if (token) {
    try {
      console.log("test");
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
      console.log("test", decoded);
      req.decoded = decoded;
      next();
    } catch (error) {
      console.error(error.message);
      return res.status(401).json({ status: "error", msg: "unauthorised" });
    }
  } else {
    return res.status(403).json({ status: "error", msg: "missing token" });
  }
};

const authAdmin = async (req, res, next) => {
  if (!("authorization" in req.headers)) {
    return res.status(400).json({ status: "error", msg: "no token found" });
  }
  const token = req.headers["authorization"].replace("Bearer ", "");
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

      const user = await Auth.findById(decoded.id).populate("role");
      console.log(decoded.id);

      if (user && user.role.role === "admin") {
        req.decoded = decoded;
        next();
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error(error.message);
      return res.status(401).json({ status: "error", msg: "unauthorised" });
    }
  } else {
    return res.status(403).json({ status: "error", msg: "missing token" });
  }
};

module.exports = { authUser, authAdmin };
