const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApplicationError = require('../errors/application-error');

// Authenticate routes
exports.authenticate = async (req, res, next) => {
    console.log(`authenticate middleware >>> `);

    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
    }
    // else if (req.cookies.token) {
    // Set token from cookie
    //   token = req.cookies.token;
    // }
    else {
        return next(new ApplicationError('Unknown user, please login to continue', 401));
    }

    // Make sure token exists
    if (!token) {
        return next(new ApplicationError('Not authorized to access this route', 401));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);

        req.user = await User.findById(decoded.id);

        next();
    } catch (err) {
        return next(new ApplicationError('Not authorized to access this route', 401));
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    console.log(`authorize middleware >>> `);

    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ApplicationError(
                    `User role ${req.user.role} is not authorized to access this route`,
                    403
                )
            );
        }
        next();
    };
};
