const AuthModel = require("../models/Auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const Auth = require("../models/Auth");

const seedUsers = async (req, res) => {
  try {
    await AuthModel.deleteMany({});

    await AuthModel.create([
      {
        _id: "660e4f16f4607111a6830cfb",
        firstName: "Dwayne",
        lastName: "Johnson",
        email: "dwaynemail@gmail.com",
        hash: "$2b$12$ZGYAzqoSxnrhZZm.fsuM9.nd/KXSdqJmerXg/FGYbcDrqsnmQOtCa",
        role: "66100b626d6defdb0da425bf",
      },
      {
        _id: "660e4f5df4607111a6830cff",
        firstName: "The",
        lastName: "Admin",
        email: "admin@gmail.com",
        hash: "$2b$12$ZGYAzqoSxnrhZZm.fsuM9.nd/KXSdqJmerXg/FGYbcDrqsnmQOtCa",
        role: "66100b626d6defdb0da425be",
      },
    ]);
    res.json({ status: "ok", msg: "seeding successful" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "error", msg: "seeding error" });
  }
};

const register = async (req, res) => {
  try {
    const auth = await AuthModel.findOne({ email: req.body.email });
    if (auth) {
      return res.status(400).json({ status: "error", msg: "duplicated email" });
    } // this check against the schema for any existing emails

    const hash = await bcrypt.hash(req.body.password, 12);
    await AuthModel.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      hash,
      role: req.body.role || "user",
    }); // this creates a hash from the password in the request body and add it to our schema
    res.json({ status: "ok", msg: "user created" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "invalid registration" });
  }
};

const login = async (req, res) => {
  console.log("logged in");
  try {
    const auth = await AuthModel.findOne({ email: req.body.email });
    if (!auth) {
      return res.status(400).json({ status: "error", msg: "no email found" });
    } //check whether the email/account exist in the database

    //the following code check whether the password matches the one in the db
    const check = await bcrypt.compare(req.body.password, auth.hash); //check entered password against db password
    if (!check) {
      console.error("invalid password or email");
      return res.status(401).json({ status: "error", msg: "login failed" });
    }

    //store the payload inside 'claims'
    const claims = {
      id: auth._id,
      email: auth.email,
      role: auth.role,
    };

    const access = jwt.sign(claims, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });

    const refresh = jwt.sign(claims, process.env.REFRESH_SECRET, {
      expiresIn: "30d",
      jwtid: uuidv4(),
    });
    res.json({ access, refresh, id: auth._id });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error logging in" });
  }
};

const refresh = async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.refresh, process.env.REFRESH_SECRET);

    //store the payload inside the claims
    const claims = {
      email: decoded.email,
      role: decoded.role,
    };

    const access = jwt.sign(claims, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });

    res.json({ access });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "refreshing token failed" });
  }
};

const update = async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 12);
    const newAuth = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      hash,
      role: req.body.role || "user",
      smartCollections: req.body.smartCollections,
    };
    await AuthModel.findByIdAndUpdate(req.params.id, newAuth);
    res.json({ status: "ok", msg: "user updated" });
  } catch (error) {
    console.error(error.message);
    res.status({ status: "error", msg: "User not updated" });
  }
};

const getAllAuth = async (req, res) => {
  try {
    const allAuth = await AuthModel.find().populate("role");
    res.json(allAuth);
  } catch (error) {
    console.error(error.message);
    res.json({ status: "error", msg: "Error encountered when fetching all" });
  }
};

module.exports = { register, login, refresh, seedUsers, update, getAllAuth };
