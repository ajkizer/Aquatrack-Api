const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const Aquarium = require("../models/Aquarium");

//@desc     Get all aquariums
//@route    GET /api/v1/aquariums
//@access   Private

exports.getAquariums = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desc     Get single aquarium
//@route    GET /api/v1/aquariums/:id
//@access   Private

exports.getSingleAquarium = asyncHandler(async (req, res, next) => {
  const aquarium = await Aquarium.findById(req.params.id).populate({
    path: "livestock",
    select: "name quantity price",
  });

  if (req.user.id !== aquarium.user.toString()) {
    return next(
      new ErrorResponse(`Aquarium does not belong to this user`, 401)
    );
  }

  if (!aquarium) {
    return next(
      new ErrorResponse(
        `Aquarium not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({ success: true, data: aquarium });
});

//@desc     Create aquarium
//@route    GET /api/v1/aquariums
//@access   Private

exports.createAquarium = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  const aquarium = await Aquarium.create(req.body);

  res.status(201).json({ success: true, data: aquarium });
});

//@desc     Update Aquarium
//@route    PUT /api/v1/aquariums/:id
//@access   Private

exports.updateAquarium = asyncHandler(async (req, res, next) => {
  let aquarium = await Aquarium.findById(req.params.id);

  if (!aquarium) {
    return next(
      new ErrorResponse(
        `Aquarium not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  if (req.user.id !== aquarium.user.toString()) {
    return next(
      new ErrorResponse(`Aquarium does not belong to this user`, 401)
    );
  }

  aquarium = await Aquarium.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: aquarium });
});

//@desc     Delete Aquarium
//@route    DELETE /api/v1/aquariums/:id
//@access   Private

exports.deleteAquarium = asyncHandler(async (req, res, next) => {
  const aquarium = await Aquarium.findById(req.params.id);

  if (!aquarium) {
    return next(
      new ErrorResponse(`Aquarium not found with the id of ${req.params.id}`),
      404
    );
  }

  if (req.user.id !== aquarium.user.toString()) {
    return next(
      new ErrorResponse(`Aquarium does not belong to this user`, 401)
    );
  }
  aquarium.remove();

  res.status(200).json({ success: true, data: {} });
});
