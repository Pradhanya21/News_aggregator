const express = require("express");
const { seedRoles, getAllRoles } = require("../controllers/roles");

const router = express.Router();

router.get("/seed", seedRoles);
router.get("/", getAllRoles);

module.exports = router;
