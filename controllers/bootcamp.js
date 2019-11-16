const BootcampModel = require("../models/Bootcamp");
const ApplicationError = require("../errors/application-error");
const BootcampNotFoundError = require("../errors/bootcamp-notfound-error");
const InvalidRequestIDError = require("../errors/invalid-request-id-error");

const geocoder = require("../utils/geocoder");

exports.getBootcamps = async (req, res, next) => {
  try {
    console.log(req.query);
    let query = { ...req.query };
    delete query.select;

    // Replacing gt|gte|in etc with $gt|$gte|$in
    const queryStr = JSON.stringify(query).replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      match => `$${match}`
    );

    console.log(`queryJSON :`);
    console.dir(JSON.parse(queryStr));

    query = BootcampModel.find(JSON.parse(queryStr));

    if (req.query.select) {
      const selectStr = req.query.select.split(",").join(" ");

      console.log(`selectStr : ${selectStr}`);
      query = query.select(selectStr);
    }

    // Executing query
    const bootcamps = await query;

    res
      .status(200)
      .json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (error) {
    next(error);
  }
};

exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await BootcampModel.findById(req.params.id);

    if (!bootcamp) throw new BootcampNotFoundError(req.params.id);

    res.status(400).json({ success: true, data: bootcamp });
  } catch (error) {
    if (error.name && error.name === "CastError")
      next(new InvalidRequestIDError(req.params.id));
    else next(error);
  }
};

exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await BootcampModel.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });
  } catch (error) {
    if (error.code && error.code === 11000)
      next(
        new ApplicationError(
          `Duplicate entry for ${Object.keys(error.keyPattern)[0]}, "${
            error.keyValue.name
          }" is already present`,
          400
        )
      );
    else next(error);
  }
};

exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await BootcampModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!bootcamp) throw new BootcampNotFoundError(req.params.id);

    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    next(error);
  }
};

exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await BootcampModel.findByIdAndDelete(req.params.id);

    if (!bootcamp) throw new BootcampNotFoundError(req.params.id);

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getBootcampsInRadius = async (req, res, next) => {
  try {
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963;

    // https://docs.mongodb.com/manual/reference/operator/query/geoWithin/
    const bootcamps = await BootcampModel.find({
      location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps
    });
  } catch (error) {
    next(error);
  }
};
