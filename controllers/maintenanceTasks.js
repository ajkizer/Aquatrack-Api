const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const Aquarium = require("../models/Aquarium");
const MaintenanceTask = require("../models/MaintenanceTask");

//@desc     Get all maintenance tasks
//@route    GET /api/v1/parameters
//@route    GET /api/v1/aquariums/:aquariumId/maintenanceTasks
//@access   Private

exports.getMaintenanceTasks = asyncHandler(async (req, res, next) => {
  let maintenanceTasks;
  if (req.params.aquariumId) {
    maintenanceTasks = await MaintenanceTask.find({
      aquarium: req.params.aquariumId,
      user: req.user.id,
    });
    return res.status(200).json({
      success: true,
      data: maintenanceTasks,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

//@desc     Get maintenance tasks by ID
//@route    GET /api/v1/maintenanceTasks/:id
//@access   Private

exports.getMaintenanceTask = asyncHandler(async (req, res, next) => {
  const maintenanceTask = await MaintenanceTask.findById(
    req.params.id
  ).populate({
    path: "aquarium",
    select: "name",
  });

  res.status(200).json({
    success: true,
    data: maintenanceTask,
  });
});

//@desc     Add maintenance tasks
//@route    POST /api/v1/aquariums/:aquariumId/maintenanceTasks
//@access   Private

exports.addMaintenanceTask = asyncHandler(async (req, res, next) => {
  if (!req.params.aquariumId) {
    return next(
      new ErrorResponse(
        `Attempted to add maintenance to incorrect route.  Please append /aquarium/:aquariumId/maintenance to the home route`
      )
    );
  }
  req.body.aquarium = req.params.aquariumId;
  req.body.user = req.user.id;

  const aquarium = await Aquarium.findById(req.params.aquariumId);

  if (!aquarium) {
    return next(
      new ErrorResponse(
        `Aquarium with the id of ${req.params.aquariumId} does not exist`
      )
    );
  }

  const maintenanceTask = await MaintenanceTask.create(req.body);

  res.status(200).json({
    success: true,
    data: maintenanceTask,
  });
});

//@desc     Update maintenance task
//@route    PUT /api/v1/maintenanceTasks/:id
//@access   Private

exports.updateMaintenanceTask = asyncHandler(async (req, res, next) => {
  let maintenanceTask = await MaintenanceTask.findById(req.params.id);
  if (!maintenanceTask) {
    return next(
      new ErrorResponse(`No maintenance tasks with the id of ${req.params.id}`)
    );
  }

  if (maintenanceTask.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this maintenance tasks item`
      )
    );
  }

  maintenanceTask = await MaintenanceTask.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: maintenanceTask,
  });
});

//@desc     Delete Maintenance
//@route    DELETE /api/v1/maintenance/:id
//@access   Private
exports.deleteMaintenanceTask = asyncHandler(async (req, res, next) => {
  const maintenanceTask = await MaintenanceTask.findById(req.params.id);

  if (!maintenanceTask) {
    return next(
      new ErrorResponse(`No maintenance tasks with the id of ${req.params.id}`),
      404
    );
  }
  if (maintenanceTask.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this item`
      )
    );
  }
  await maintenanceTask.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
