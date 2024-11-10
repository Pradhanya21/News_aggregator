const mongoose = require("mongoose");

const RolesSchema = new mongoose.Schema({
  role: { type: String, require: true },
});

module.exports = mongoose.model("Roles", RolesSchema);
