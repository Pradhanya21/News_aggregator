const SmartCollectionsModel = require("../models/SmartCollections");

// seed collection
const seedSmartCollection = async (req, res) => {
  try {
    await SmartCollectionsModel.deleteMany({});

    await SmartCollectionsModel.create([
      {
        q: "Market",
        auth: "660e4f16f4607111a6830cfb", // addition of auth Object ID in the seed content
      },
      {
        q: "Tech Startups",
        auth: "660e4f16f4607111a6830cfb",
      },
      {
        q: "Animal Nutrition",
        auth: "660e4f16f4607111a6830cfb",
      },
      {
        q: "US elections",
        auth: "660e4f16f4607111a6830cfb",
      },
      {
        q: "Maritime shipping",
        auth: "660e4f5df4607111a6830cff",
      },
      {
        q: "Switzerland",
        auth: "660e4f5df4607111a6830cff",
      },
    ]);

    res.json({ status: "ok", msg: "seeding successful" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "seeding error" });
  }
};

// get all collections
const getAllSmartCollections = async (req, res) => {
  try {
    const allCollections = await SmartCollectionsModel.find();
    res.json(allCollections);
  } catch (error) {
    console.log(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "error getting all collections" });
  }
};

// add new collection
const addSmartCollection = async (req, res) => {
  try {
    const newCollection = {
      q: req.body.q,
      auth: req.params.id, // to check if auth Object ID should be included in each SmartCollection creation - body or params
    };
    await SmartCollectionsModel.create(newCollection);

    res.json({ status: "ok", msg: "collection saved" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "collection not saved" });
  }
};

// update content of one collection
const patchSmartCollection = async (req, res) => {
  try {
    const response = await SmartCollectionsModel.findByIdAndUpdate(
      req.params.id,
      {
        q: req.body.q,
      }
    );
    res.json({ status: "ok", msg: "collection updated" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error updating collection" });
  }
};

// delete collection
const deleteSmartCollection = async (req, res) => {
  try {
    const response = await SmartCollectionsModel.findByIdAndDelete(
      req.params.id
    );
    res.json({ status: "ok", msg: "collection deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error deleting collection" });
  }
};

// get smartCollections by user ObjectID
const getCollectionByUserID = async (req, res) => {
  try {
    const smartCollections = await SmartCollectionsModel.find({
      auth: req.params.id,
    });
    res.json(smartCollections);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({
      status: "error",
      msg: "error getting smart collection by user ID",
    });
  }
};

module.exports = {
  seedSmartCollection,
  getAllSmartCollections,
  addSmartCollection,
  patchSmartCollection,
  deleteSmartCollection,
  getCollectionByUserID,
};
