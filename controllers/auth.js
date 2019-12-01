const User = require('../models/User');
const LoginError = require('../errors/login-error');

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role
        });

        sendTokenResponse(user, res);
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return next(new LoginError('Please enter both email & password.'));

        const user = await User.findOne({ email }).select('+password');

        if (!user) return next(new LoginError('Invalid credentials', 401));

        const isMatch = await user.comparePassword(password);

        if (!isMatch) return next(new LoginError('Invalid credentials', 401));

        sendTokenResponse(user, res);
    } catch (error) {
        next(error);
    }
};

const sendTokenResponse = (user, res) => {
    console.log(`sendTokenResponse >>> `);
    console.log(user);

    // Create token
    const token = user.getSignedJWTToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(200)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        });
};



exports.getMe = async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    })
}