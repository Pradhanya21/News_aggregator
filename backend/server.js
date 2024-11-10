require("dotenv").config();

const express = require("express");
const connectDB = require("./src/db/db");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const smartCollections = require("./src/routers/smartCollections");
const auth = require("./src/routers/auth");
const roles = require("./src/routers/roles");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  standardHeaders: true,
  legacyHeaders: false,
});

connectDB();

const app = express();
app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", smartCollections);
app.use("/auth", auth);
app.use("/roles", roles);

//-----Testing section for the login/registration auth (can be deleted once smart collection schema is out)
const { authUser, authAdmin } = require("./src/middleware/auth");
app.get("/user", authUser, (req, res) => {
  res.send("running - user and admin");
}); //basic testing to make sure everything works

app.get("/admin", authAdmin, (req, res) => {
  res.send("running - admin only");
}); //basic testing to make sure everything works
//---------------------------------------------------------------------

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
