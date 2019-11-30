module.exports = (err, req, res, next) => {
  console.log(`Error handler middleware`.red.bold);

  res.status(err.statusCode || 400).json({
    success: false,
    error: err.message
  });
};
