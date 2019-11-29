const BootcampModel = require("../models/Bootcamp");
const ApplicationError = require("../errors/application-error");
const BootcampNotFoundError = require("../errors/bootcamp-notfound-error");
const InvalidRequestIDError = require("../errors/invalid-request-id-error");

const geocoder = require("../utils/geocoder");

exports.getBootcamps = async (req, res, next) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = BootcampModel.find(JSON.parse(queryStr)).populate('courses');

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await BootcampModel.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const results = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res
      .status(200)
      .json({ success: true, count: results.length, pagination, data: results });
  } catch (error) {
    next(error);
  }
};

/**exports.getBootcamps = async (req, res, next) => {
  try {
    console.log(`getBootcamps NEW :`);

    const result = await BootcampModel.find();

    res.status(400).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};*/

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
