const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js');
const spot = require('../../db/models/spot.js');

const router = express.Router();

router.get('/', async (req, res, next) => {
    const spots = await Spot.findAll({
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ]
    });
    const spotObj = {};
    const spotsList = [];

    spots.forEach(spot => {
        spotsList.push(spot.toJSON())
    });

    spotsList.forEach(spot => {
        let total = 0;
        spot.Reviews.forEach(review => {
            total += review.stars;
        });
        spot.avgRating = total / spot.Reviews.length;
        delete spot.Reviews;

        spot.SpotImages.forEach(image => {
            if (image.preview === true) {
                spot.previewImage = image.url
            }
        });
        delete spot.SpotImages;
    })

    spotObj.Spots = spotsList;

    return res.json(spotObj)
})

module.exports = router;
