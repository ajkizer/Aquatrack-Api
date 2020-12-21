const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const Aquarium = require("../models/Aquarium");
const ParameterCheck = require("../models/ParameterCheck");

//@desc     Get all parameter checks
//@route    GET /api/v1/parameters
//@route    GET /api/v1/aquariums/:aquariumId/parameters
//@access   Private

exports.getParamCheck = asyncHandler(async (req, res, next) => {
  let parameterCheck;
  if (req.params.aquariumId) {
    parameterCheck = await ParameterCheck.find({
      aquarium: req.params.aquariumId,
      user: req.user.id,
    });
    return res.status(200).json({
      success: true,
      data: parameterCheck,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

//@desc     Get parameter check by ID
//@route    GET /api/v1/parameters/:id
//@access   Private

exports.getSingleParamCheck = asyncHandler(async (req, res, next) => {
  const parameterCheck = await ParameterCheck.findById(req.params.id).populate({
    path: "aquarium",
    select: "name",
  });

  res.status(200).json({
    success: true,
    data: parameterCheck,
  });
});

//@desc     Add parameter check
//@route    POST /api/v1/aquariums/:aquariumId/parameters
//@access   Private

exports.addParamCheck = asyncHandler(async (req, res, next) => {
  if (!req.params.aquariumId) {
    return next(
      new ErrorResponse(
        `Attempted to add parameters to incorrect route.  Please append /aquarium/:aquariumId/parameters to the home route`
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

  const parameterCheck = await ParameterCheck.create(req.body);

  res.status(200).json({
    success: true,
    data: parameterCheck,
  });
});

//@desc     Update Parameter Check
//@route    PUT /api/v1/parameters/:id
//@access   Private

exports.updateParamCheck = asyncHandler(async (req, res, next) => {
  let parameterCheck = await ParameterCheck.findById(req.params.id);
  if (!parameterCheck) {
    return next(
      new ErrorResponse(`No parameter check with the id of ${req.params.id}`)
    );
  }

  if (parameterCheck.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this parameter check item`
      )
    );
  }

  parameterCheck = await ParameterCheck.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: parameterCheck,
  });
});

//@desc     Delete Parameter Check
//@route    DELETE /api/v1/parameters/:id
//@access   Private
exports.deleteParamCheck = asyncHandler(async (req, res, next) => {
  const parameterCheck = await ParameterCheck.findById(req.params.id);

  if (!parameterCheck) {
    return next(
      new ErrorResponse(`No parameterCheck with the id of ${req.params.id}`),
      404
    );
  }
  if (parameterCheck.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this item`
      )
    );
  }
  await parameterCheck.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
