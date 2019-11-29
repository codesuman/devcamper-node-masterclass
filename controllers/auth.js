const User = require('../models/User');

exports.register = async (req, res, next) => {
    res.status(200).json({ success: true, message: 'Register is invoked' });
};