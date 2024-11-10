const mongoose = require("mongoose");
const SmartCollections = require("../models/SmartCollections");

const AuthSchema = new mongoose.Schema(
  {
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    email: { type: String, require: true },
    hash: { type: String, require: true },
    role: { type: mongoose.Schema.Types.ObjectId, require: true, ref: "Roles" },
    created_at: { type: Date, default: Date.now },
    smartCollections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SmartCollections",
      },
    ], //using an array of object because this is a one to many relationship
  },
  { collection: "auth" }
);

module.exports = mongoose.model("Auth", AuthSchema);
