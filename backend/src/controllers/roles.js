const RolesModel = require("../models/Roles");

const seedRoles = async (req, res) => {
  try {
    await RolesModel.deleteMany({});

    await RolesModel.create([
      {
        _id: "66100b626d6defdb0da425be",
        role: "admin",
      },
      {
        _id: "66100b626d6defdb0da425bf",
        role: "user",
      },
    ]);
    res.json({ status: "ok", msg: "seeding successful" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "error", msg: "seeding error" });
  }
};

const getAllRoles = async (req, res) => {
  try {
    const roles = await RolesModel.find();
    res.json(roles.map((item) => item.role));
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "cannot get roles" });
  }
};

module.exports = { seedRoles, getAllRoles };
