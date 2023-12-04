const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, ReviewImage, User, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js');

const router = express.Router();

router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;

    const reviews = await Review.findAll({
        where: {
            userId: user.id
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: {
                    exclude: ['description', 'createdAt', 'updatedAt']
                },
                include: [
                    {
                        model: SpotImage
                    }
                ]
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    const reviewObj = {};
    const reviewsList = [];

    reviews.forEach(review => {
        reviewsList.push(review.toJSON())
    });

    reviewsList.forEach(review => {
        review.Spot.SpotImages.forEach(image => {
            if (image.preview === true) {
                review.Spot.previewImage = image.url;
            }
        });
        delete review.Spot.SpotImages;
    });

    reviewObj.Reviews = reviewsList;

    return res.json(reviewObj);
});

module.exports = router;
