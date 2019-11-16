module.exports = (err, req, res, next) => {
  console.log(`Log error middleware`.red.bold);

  console.error(err);
  next(err);
};
