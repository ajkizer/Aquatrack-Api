const express = require("express");
const {
  getMaintenanceTasks,
  getMaintenanceTask,
  addMaintenanceTask,
  updateMaintenanceTask,
  deleteMaintenanceTask,
} = require("../controllers/maintenanceTasks");

const { protect } = require("../middleware/auth");

const MaintenanceTask = require("../models/MaintenanceTask");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../middleware/advancedResults");

router
  .route("/")
  .get(
    protect,
    advancedResults(MaintenanceTask, { path: "aquarium", select: "name size" }),
    getMaintenanceTasks
  )
  .post(protect, addMaintenanceTask);

router
  .route("/:id")
  .get(protect, getMaintenanceTask)
  .put(protect, updateMaintenanceTask)
  .delete(protect, deleteMaintenanceTask);

module.exports = router;
