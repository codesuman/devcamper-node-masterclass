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

        const token = user.getSignedJWTToken();

        res.status(200).json({ success: true, token });
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

        const token = user.getSignedJWTToken();

        res.status(200).json({ success: true, token });
    } catch (error) {
        next(error);
    }
};