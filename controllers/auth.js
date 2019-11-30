const User = require('../models/User');

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

        res.status(200).json({ success: true, message: 'Register is invoked' });
    } catch (error) {
        next(error);
    }
};