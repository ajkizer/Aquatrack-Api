const express = require("express");
const {
  getParamCheck,
  addParamCheck,
  getSingleParamCheck,
  updateParamCheck,
  deleteParamCheck,
} = require("../controllers/parameterChecks");

const { protect } = require("../middleware/auth");

const ParameterCheck = require("../models/ParameterCheck");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../middleware/advancedResults");

router
  .route("/")
  .get(
    protect,
    advancedResults(ParameterCheck, { path: "aquarium", select: "name size" }),
    getParamCheck
  )
  .post(protect, addParamCheck);

router
  .route("/:id")
  .get(protect, getSingleParamCheck)
  .put(protect, updateParamCheck)
  .delete(protect, deleteParamCheck);

module.exports = router;
