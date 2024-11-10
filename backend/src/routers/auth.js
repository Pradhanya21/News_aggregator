const express = require("express");
const {
  register,
  login,
  refresh,
  seedUsers,
  getAllAuth,
  update,
} = require("../controllers/auth");
const { errorCheck } = require("../validators/errorCheck");
const {
  validateLogin,
  validateRegister,
  validateRefresh,
} = require("../validators/auth");
const { authAdmin, authUser } = require("../middleware/auth");

const router = express.Router();

router.put("/register", validateRegister, errorCheck, register);
router.post("/login", validateLogin, errorCheck, login);
router.post("/refresh", authUser, validateRefresh, errorCheck, refresh);
router.get("/seed", seedUsers);
router.get("/allUser", authAdmin, getAllAuth);
router.patch("/update/:id", authAdmin, validateRegister, errorCheck, update);

module.exports = router;
