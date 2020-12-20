const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const Livestock = require("../models/Livestock");
const Aquarium = require("../models/Aquarium");

//@desc     Get all livestock
//@route    GET /api/v1/livestock
//@route    GET /api/v1/aquariums/:aquariumId/livestock
//@access   Private

exports.getLivestock = asyncHandler(async (req, res, next) => {
  let livestock;
  if (req.params.aquariumId) {
    livestock = await Livestock.find({
      aquarium: req.params.aquariumId,
      user: req.user.id,
    });
    return res.status(200).json({
      success: true,
      data: livestock,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

//@desc     Get livestock by ID
//@route    GET /api/v1/livestock/:id
//@access   Private

exports.getSingleLivestock = asyncHandler(async (req, res, next) => {
  const livestock = await Livestock.findById(req.params.id).populate({
    path: "aquarium",
    select: "name",
  });

  if (!livestock) {
    return next(
      new ErrorResponse(`No livestock with the id of ${req.params.id}`),
      400
    );
  }

  res.status(200).json({
    success: true,
    data: livestock,
  });
});

//@desc     Add livestock
//@route    GET /api/v1/aquariums/:aquariumId/livestock
//@access   Private

exports.addLivestock = asyncHandler(async (req, res, next) => {
  if (!req.params.aquariumId) {
    return next(
      new ErrorResponse(
        `Attempted to add livestock to incorrect route.  Please append /aquarium/:aquariumId/livestock to the home route`
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

  const livestock = await Livestock.create(req.body);

  res.status(200).json({
    success: true,
    data: livestock,
  });
});

//@desc     Update Livestock
//@route    PUT /api/v1/livestock/:id
//@access   Private

exports.updateLivestock = asyncHandler(async (req, res, next) => {
  let livestock = await Livestock.findById(req.params.id);
  if (!livestock) {
    return next(
      new ErrorResponse(`No livestock with the id of ${req.params.id}`)
    );
  }

  if (livestock.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this livestock item`
      )
    );
  }

  livestock = await Livestock.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: livestock,
  });
});

//@desc     Delete Livestock
//@route    DELETE /api/v1/livestock/:id
//@access   Private
exports.deleteLivestock = asyncHandler(async (req, res, next) => {
  const livestock = await Livestock.findById(req.params.id);

  if (!livestock) {
    return next(
      new ErrorResponse(`No livestock with the id of ${req.params.id}`),
      404
    );
  }
  if (livestock.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this item`
      )
    );
  }
  await livestock.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
