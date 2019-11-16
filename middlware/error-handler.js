module.exports = (err, req, res, next) => {
  console.log(`Error handler middleware`.red.bold);

  res.status(err.statusCode).json({
    success: false,
    error: err.message
  });
};
