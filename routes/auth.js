const express = require('express');
const {
    register,
    login,
    getMe
} = require('../controllers/auth');


const { authenticate } = require('../middlware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);

module.exports = router;
