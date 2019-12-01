const express = require("express");
const router = express.Router();

const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius
} = require("../controllers/bootcamp");

const courseRoutes = require("./course");

// Re-route to other routes
router.use("/:bootcampId/courses", courseRoutes);

router
  .use("/", (req, res, next) => {
    console.log(`Bootcamp.js : router.use => /`);
    next();
  });

router
  .route("/")
  .get((req, res, next) => {
    console.log(`Bootcamp.js : router.route.get => /`);
    next();
  }, getBootcamps)
  .post(createBootcamp);

router
  .use("/:id", (req, res, next) => {
    console.log(`Bootcamp.js : router.use => /:id`);
    next();
  });

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

module.exports = router;
