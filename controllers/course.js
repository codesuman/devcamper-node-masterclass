const CourseModel = require("../models/Course");
const ApplicationError = require("../errors/application-error");
const CourseNotFoundError = require("../errors/course-notfound-error");
const InvalidRequestIDError = require("../errors/invalid-request-id-error");

exports.getCourses = async (req, res, next) => {
    try {
        let query;

        if (req.params.bootcampId) {
            query = CourseModel.find({ 'bootcamp': req.params.bootcampId });
        } else {
            query = CourseModel.find().populate({
                path: 'bootcamp',
                select: 'name description website'
            });
        }

        const courses = await query;

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (error) {
        next(error);
    }
}

exports.createCourse = async (req, res, next) => {
    try {
        const course = await CourseModel.create(req.body);
        res.status(201).json({ success: true, data: course });
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