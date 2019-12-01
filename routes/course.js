const express = require("express");
const router = express.Router({ mergeParams: true });
// https://stackoverflow.com/questions/25260818/
const {
    getCourses,
    createCourse
} = require("../controllers/course");

router
    .use("/", (req, res, next) => {
        console.log(`Course.js : router.use => /`);
        next();
    });

router
    .route("/")
    .get(getCourses)
    .post(createCourse);

module.exports = router;
