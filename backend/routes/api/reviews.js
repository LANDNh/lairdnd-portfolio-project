const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, ReviewImage, User, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js');

const router = express.Router();

const reviewAuthorize = async (req, res, next) => {
    const { user } = req;
    const review = await Review.findByPk(req.params.reviewId);

    if (!review) {
        return res.status(404).json({
            message: 'Review couldn\'t be found'
        });
    } else if (user.id !== review.userId) {
        return res.status(403).json({
            message: 'Forbidden'
        });
    } else {
        next();
    }
};

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .custom(async val => {
            if (!val || val < 1 || val > 5) {
                throw new Error('Stars must be an integer from 1 to 5')
            }
        }),
    handleValidationErrors
];

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
        review.Spot.lat = Number(review.Spot.lat);
        review.Spot.lng = Number(review.Spot.lng);
        review.Spot.price = Number(review.Spot.price);

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

router.post('/:reviewId/images', requireAuth, reviewAuthorize, async (req, res, next) => {
    const { url } = req.body;
    const review = await Review.findByPk(req.params.reviewId, {
        include: [
            {
                model: ReviewImage
            }
        ]
    });

    const max = await review.countReviewImages();

    if (max >= 10) {
        return res.status(403).json({
            message: 'Maximum number of images for this resource was reached'
        });
    }

    const imageObj = {};
    const newImage = await ReviewImage.create({
        reviewId: review.id,
        url
    });

    imageObj.id = newImage.id;
    imageObj.url = newImage.url;

    return res.json(imageObj);
});

router.put('/:reviewId', requireAuth, reviewAuthorize, validateReview, async (req, res, next) => {
    const { review, stars } = req.body;
    const updatedReview = await Review.findByPk(req.params.reviewId);

    updatedReview.set({
        review: review || updatedReview.review,
        stars: stars || updatedReview.stars
    });

    await updatedReview.save();

    return res.json(updatedReview);
});

router.delete('/:reviewId', requireAuth, reviewAuthorize, async (req, res, next) => {
    const review = await Review.findByPk(req.params.reviewId);

    await review.destroy();

    return res.json({
        message: 'Successfully deleted'
    });
});

module.exports = router;
