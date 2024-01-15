const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js');

const router = express.Router();

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Invalid email'),
    check('username')
        .exists({ checkFalsy: true })
        .withMessage('Username is required'),
    check('username')
        .custom(async val => {
            if (!val || val.length < 4 || val.length > 30) {
                throw new Error('Username must be between 4 and 30 characters')
            }
        }),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('firstName')
        .exists({ checkFalsy: true })
        .withMessage('First Name is required'),
    check('lastName')
        .exists({ checkFalsy: true })
        .withMessage('Last Name is required'),
    handleValidationErrors
];

router.post('/', validateSignup, async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, username } = req.body;
        const hashedPassword = bcrypt.hashSync(password);
        const user = await User.create({ firstName, lastName, email, username, hashedPassword });
        const safeUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username
        };

        await setTokenCookie(res, safeUser);

        res.json({
            user: safeUser
        });
    } catch (err) {
        const errObj = {};

        err.errors.forEach(e => {
            if (e.path === 'email') {
                errObj.email = 'User with that email already exists'
            } else {
                errObj.username = 'User with that username already exists'
            }
        });

        return res.status(500).json({
            message: 'User already exists',
            errors: errObj
        });
    }
})

module.exports = router;
