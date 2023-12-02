const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js');
const spot = require('../../db/models/spot.js');

const router = express.Router();

const spotAuthorize = async (req, res, next) => {
    const { user } = req;
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        return res.status(404).json({
            message: 'Spot couldn\'t be found'
        });
    } else if (user.id !== spot.ownerId) {
        return res.status(403).json({
            message: 'Forbidden'
        });
    } else {
        next();
    }
};

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
    });

    spotObj.Spots = spotsList;

    return res.json(spotObj)
});

router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;

    const spots = await Spot.findAll({
        where: {
            ownerId: user.id
        },
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
    });

    spotObj.Spots = spotsList;

    return res.json(spotObj)
});

router.get('/:spotId', async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId, {
        include: [
            {
                model: Review
            },
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }
        ],
    });
    if (!spot) {
        return res.status(404).json({
            message: 'Spot couldn\'t be found'
        });
    } else {
        let total = 0;
        spot.Reviews.forEach(review => {
            total += review.stars;
        });

        const spotObj = {
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: Number(spot.lat),
            lng: Number(spot.lng),
            name: spot.name,
            description: spot.description,
            price: Number(spot.price),
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            numReviews: await spot.countReviews(),
            avgStarRating: total / spot.Reviews.length,
            SpotImages: spot.SpotImages,
            Owner: spot.User
        }

        return res.json(spotObj);
    }
});

const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat')
        .custom(async val => {
            if (!val || val < -90 || val > 90) {
                throw new Error('Latitude must be within -90 and 90')
            }
        }),
    check('lng')
        .custom(async val => {
            if (!val || val < -180 || val > 180) {
                throw new Error('Longitude must be within -180 and 180')
            }
        }),
    check('name')
        .custom(async val => {
            if (!val || val.length > 49) {
                throw new Error('Name must be less than 50 characters')
            }
        }),
    check('description')
        .exists()
        .withMessage('Description is required'),
    check('price')
        .custom(async val => {
            if (!val || val < 0) {
                throw new Error('Price per day must be a positive number')
            }
        }),
    handleValidationErrors
];

router.post('/', requireAuth, validateSpot, async (req, res, next) => {
    const { user } = req;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const newSpot = await Spot.create({
        ownerId: user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    });

    return res.json(newSpot);
});

router.post('/:spotId/images', requireAuth, spotAuthorize, async (req, res, next) => {
    const { url, preview } = req.body;

    const imgObj = {};
    const newImage = await SpotImage.create({
        spotId: req.params.spotId,
        url,
        preview
    });

    imgObj.id = newImage.id;
    imgObj.url = newImage.url;
    imgObj.preview = newImage.preview;

    return res.json(imgObj);
});

router.put('/:spotId', requireAuth, spotAuthorize, validateSpot, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const spot = await Spot.findByPk(req.params.spotId);

    spot.set({
        address: address || spot.address,
        city: city || spot.city,
        state: state || spot.state,
        country: country || spot.country,
        lat: lat || spot.lat,
        lng: lng || spot.lng,
        name: name || spot.name,
        description: description || spot.description,
        price: price || spot.price
    });

    await spot.save();

    return res.json(spot);
});

router.delete('/:spotId', requireAuth, spotAuthorize, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId);

    await spot.destroy();

    return res.json({
        message: 'Successfully deleted'
    });
})

module.exports = router;
