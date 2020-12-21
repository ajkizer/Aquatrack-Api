const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const Plant = require("../models/Plant");
const Aquarium = require("../models/Aquarium");

//@desc     Get all plants
//@route    GET /api/v1/plants
//@route    GET /api/v1/aquariums/:aquariumId/plants
//@access   Private

exports.getPlants = asyncHandler(async (req, res, next) => {
  let plants;
  if (req.params.aquariumId) {
    plants = await Plant.find({
      aquarium: req.params.aquariumId,
      user: req.user.id,
    });
    return res.status(200).json({
      success: true,
      data: plants,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

//@desc     Get plants by ID
//@route    GET /api/v1/plants/:id
//@access   Private

exports.getSinglePlant = asyncHandler(async (req, res, next) => {
  const plant = await Plant.findById(req.params.id).populate({
    path: "aquarium",
    select: "name",
  });

  if (!plant) {
    return next(
      new ErrorResponse(`No plants with the id of ${req.params.id}`),
      400
    );
  }

  res.status(200).json({
    success: true,
    data: plant,
  });
});

//@desc     Add plants
//@route    GET /api/v1/aquariums/:aquariumId/plants
//@access   Private

exports.addPlant = asyncHandler(async (req, res, next) => {
  if (!req.params.aquariumId) {
    return next(
      new ErrorResponse(
        `Attempted to add plants to incorrect route.  Please append /aquarium/:aquariumId/plants to the home route`
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

  const plant = await Plant.create(req.body);

  res.status(200).json({
    success: true,
    data: plant,
  });
});

//@desc     Update plant
//@route    PUT /api/v1/plants/:id
//@access   Private

exports.updatePlant = asyncHandler(async (req, res, next) => {
  let plant = await Plant.findById(req.params.id);
  if (!plant) {
    return next(new ErrorResponse(`No plants with the id of ${req.params.id}`));
  }

  if (plant.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this item`
      )
    );
  }

  plant = await Plant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: plant,
  });
});

//@desc     Delete plant
//@route    DELETE /api/v1/plants/:id
//@access   Private
exports.deletePlant = asyncHandler(async (req, res, next) => {
  const plant = await Plant.findById(req.params.id);

  if (!plant) {
    return next(
      new ErrorResponse(`No plants with the id of ${req.params.id}`),
      404
    );
  }
  if (plant.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this item`
      )
    );
  }
  await plant.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
