const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, ReviewImage, User, Booking, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js');

const router = express.Router();

const reviewImageAuthorize = async (req, res, next) => {
    const { user } = req;
    const image = await ReviewImage.findByPk(req.params.imageId);

    if (!image) {
        return res.status(404).json({
            message: 'Review Image couldn\'t be found'
        });
    }

    const review = await Review.findByPk(image.reviewId);

    if (user.id !== review.userId) {
        return res.status(403).json({
            message: 'Forbidden'
        });
    } else {
        next();
    }
};

router.delete('/:imageId', requireAuth, reviewImageAuthorize, async (req, res, next) => {
    const image = await ReviewImage.findByPk(req.params.imageId);

    await image.destroy();

    return res.json({
        message: 'Successfully deleted'
    });
});

module.exports = router;
