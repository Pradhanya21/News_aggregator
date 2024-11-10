const mongoose = require("mongoose");
const { Auth } = require("./Auth");

const SmartCollectionsSchema = new mongoose.Schema(
  {
    q: { type: String, required: true, minLength: 1, maxLength: 30 },
    from: {
      type: String,
      default: () => {
        const date = Date.now() - 14 * 24 * 60 * 60 * 1000;
        return new Date(date).toLocaleString();
      },
    },
    minClusterSize: { type: Number, min: 5, default: 5 },
    sortBy: { type: String, default: "createdAt" },
    auth: { type: mongoose.Schema.Types.ObjectId, ref: "Auth" },
  },
  { collection: "smartCollections" }
);

module.exports = mongoose.model("SmartCollections", SmartCollectionsSchema);
