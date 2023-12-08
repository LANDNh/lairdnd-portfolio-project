const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, ReviewImage, User, Booking, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js');

const router = express.Router();

const spotImageAuthorize = async (req, res, next) => {
    const { user } = req;
    const image = await SpotImage.findByPk(req.params.imageId);

    if (!image) {
        return res.status(404).json({
            message: 'Spot Image couldn\'t be found'
        });
    }

    const spot = await Spot.findByPk(image.spotId);

    if (user.id !== spot.ownerId) {
        return res.status(403).json({
            message: 'Forbidden'
        });
    } else {
        next();
    }
};

router.delete('/:imageId', requireAuth, spotImageAuthorize, async (req, res, next) => {
    const image = await SpotImage.findByPk(req.params.imageId);

    await image.destroy();

    return res.json({
        message: 'Successfully deleted'
    });
});

module.exports = router;
