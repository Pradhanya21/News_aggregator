const express = require("express");
const {
  seedSmartCollection,
  getAllSmartCollections,
  addSmartCollection,
  patchSmartCollection,
  deleteSmartCollection,
  getCollectionByUserID,
} = require("../controllers/smartCollections");
const {
  validateIdInParam,
  validateAddSmartCollectionData,
  validateUpdateSmartCollectionData,
} = require("../validators/smartCollections");
const { errorCheck } = require("../validators/errorCheck");
const { authUser } = require("../middleware/auth");
const router = express.Router();

router.get("/seed", seedSmartCollection);
router.get("/", getAllSmartCollections);
router.put(
  "/:id",
  authUser,
  validateIdInParam,
  validateAddSmartCollectionData,
  errorCheck,
  addSmartCollection
); // add collection to a specific auth object ID -- in req params or body?
router.patch(
  "/:id",
  authUser,
  validateIdInParam,
  validateUpdateSmartCollectionData,
  errorCheck,
  patchSmartCollection
);
router.delete(
  "/:id",
  authUser,
  validateIdInParam,
  errorCheck,
  deleteSmartCollection
);
router.get(
  "/:id",
  authUser,
  validateIdInParam,
  errorCheck,
  getCollectionByUserID
);

module.exports = router;
