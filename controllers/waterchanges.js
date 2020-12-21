const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const Aquarium = require("../models/Aquarium");
const Waterchange = require("../models/Waterchange");

//@desc     Get all waterchanges
//@route    GET /api/v1/waterchanges
//@route    GET /api/v1/aquariums/:aquariumId/waterchanges
//@access   Private

exports.getWaterchanges = asyncHandler(async (req, res, next) => {
  let waterchange;
  if (req.params.aquariumId) {
    waterchange = await Waterchange.find({
      aquarium: req.params.aquariumId,
      user: req.user.id,
    });
    return res.status(200).json({
      success: true,
      data: waterchange,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

//@desc     Get waterchange by ID
//@route    GET /api/v1/waterchanges/:id
//@access   Private

exports.getSingleWaterchange = asyncHandler(async (req, res, next) => {
  const waterchange = await Waterchange.findById(req.params.id).populate({
    path: "aquarium",
    select: "name",
  });

  res.status(200).json({
    success: true,
    data: livestock,
  });
});

//@desc     Add waterchange
//@route    GET /api/v1/aquariums/:aquariumId/waterchanges
//@access   Private

exports.addWaterchange = asyncHandler(async (req, res, next) => {
  if (!req.params.aquariumId) {
    return next(
      new ErrorResponse(
        `Attempted to add waterchange to incorrect route.  Please append /aquarium/:aquariumId/waterchanges to the home route`
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

  const waterchange = await Waterchange.create(req.body);

  res.status(200).json({
    success: true,
    data: waterchange,
  });
});

//@desc     Update Waterchange
//@route    PUT /api/v1/waterchange/:id
//@access   Private

exports.updateWaterchange = asyncHandler(async (req, res, next) => {
  let waterchange = await Waterchange.findById(req.params.id);
  if (!waterchange) {
    return next(
      new ErrorResponse(`No waterchange with the id of ${req.params.id}`)
    );
  }

  if (waterchange.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this waterchange item`
      )
    );
  }

  waterchange = await Waterchange.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: waterchange,
  });
});

//@desc     Delete Waterchange
//@route    DELETE /api/v1/waterchanges/:id
//@access   Private
exports.deleteWaterchange = asyncHandler(async (req, res, next) => {
  const waterchange = await Waterchange.findById(req.params.id);

  if (!waterchange) {
    return next(
      new ErrorResponse(`No waterchange with the id of ${req.params.id}`),
      404
    );
  }
  if (waterchange.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this item`
      )
    );
  }
  await waterchange.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
