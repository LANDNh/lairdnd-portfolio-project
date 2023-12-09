const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, ReviewImage, User, Booking, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, handleBookingConflict } = require('../../utils/validation.js');
const { Op } = require('sequelize');
const spot = require('../../db/models/spot.js');
const booking = require('../../db/models/booking.js');

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

const spotUnauthorize = async (req, res, next) => {
    const { user } = req;
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        return res.status(404).json({
            message: 'Spot couldn\'t be found'
        });
    } else if (user.id === spot.ownerId) {
        return res.status(403).json({
            message: 'Forbidden'
        });
    } else {
        next();
    }
};

const noBookingAround = async (req, res, next) => {
    const { startDate, endDate } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const errRes = { message: 'Sorry, this spot is already booked for the specified dates', errors: {} }
    const spot = await Spot.findByPk(req.params.spotId, {
        include: [
            {
                model: Booking
            }
        ]
    });

    spot.Bookings.forEach(booking => {
        const bookingStart = new Date(booking.startDate);
        const bookingEnd = new Date(booking.endDate);

        if (bookingStart >= start && bookingEnd <= end) {
            errRes.errors.startDate = 'Start date conflicts with an existing booking';
            errRes.errors.endDate = 'End date conflicts with an existing booking';
        }
    });

    if (Object.entries(errRes.errors).length) {
        return res.status(403).json(errRes);
    } else next();
}

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

const validateBooking = [
    check('startDate')
        .custom(async val => {
            const start = new Date(val);
            const now = new Date();

            if (start < now) {
                throw new Error('startDate cannot be in the past')
            }
        }),
    check('endDate')
        .custom(async (val, { req }) => {
            const { startDate } = req.body;
            const start = new Date(startDate);
            const startBuffer = new Date(start.getTime() + 86300000)
            const end = new Date(val);
            const now = new Date();

            if (end < now || end <= startBuffer) {
                throw new Error('endDate cannot be on or before startDate')
            }
        }),
    handleValidationErrors
];

const bookingConflictCheck = [
    check('startDate')
        .custom(async (val, { req }) => {
            const newDate = new Date(val);
            const spot = await Spot.findByPk(req.params.spotId, {
                include: [
                    {
                        model: Booking
                    }
                ]
            });

            spot.Bookings.forEach(booking => {
                const bookingStart = new Date(booking.startDate);
                const bookingEnd = new Date(booking.endDate);

                if (newDate >= bookingStart && newDate <= bookingEnd) {
                    throw new Error('Start date conflicts with an existing booking')
                }
            });
        }),
    check('endDate')
        .custom(async (val, { req }) => {
            const newDate = new Date(val);
            const spot = await Spot.findByPk(req.params.spotId, {
                include: [
                    {
                        model: Booking,
                    }
                ]
            });

            spot.Bookings.forEach(booking => {
                const bookingStart = new Date(booking.startDate);
                const bookingEnd = new Date(booking.endDate);

                if (newDate >= bookingStart && newDate <= bookingEnd) {
                    throw new Error('End date conflicts with an existing booking')
                }
            });
        }),
    handleBookingConflict
];

const validateQuery = [
    check('page')
        .custom(async val => {
            if (val < 1 || val > 10) {
                throw new Error('Page must be greater than or equal to 1');
            }
        }),
    check('size')
        .custom(async val => {
            if (val < 1 || val > 20) {
                throw new Error('Size must be greater than or equal to 1');
            }
        }),
    check('minLat')
        .custom(async val => {
            if (!val) return;
            if (Number(val) && Number(val) >= -90) return;
            throw new Error('Minimum latitude is invalid');

        }),
    check('maxLat')
        .custom(async val => {
            if (!val) return;
            if (Number(val) && Number(val) <= 90) return;
            throw new Error('Maximum latitude is invalid');

        }),
    check('minLng')
        .custom(async val => {
            if (!val) return;
            if (Number(val) && Number(val) >= -180) return;
            throw new Error('Minimum longitude is invalid');

        }),
    check('maxLng')
        .custom(async val => {
            if (!val) return;
            if (Number(val) && Number(val) <= 180) return;
            throw new Error('Maximum longitude is invalid');

        }),
    check('minPrice')
        .custom(async val => {
            if (!val) return;
            if (Number(val) && Number(val) >= 0) return
            throw new Error('Minimum price must be greater than or equal to 0');

        }),
    check('maxPrice')
        .custom(async val => {
            if (!val) return;
            if (Number(val) && Number(val) >= 0) return;
            throw new Error('Maximum price must be greater than or equal to 0');

        }),
    handleValidationErrors
];

router.get('/', validateQuery, async (req, res, next) => {
    let { page, size } = req.query;
    let pagination = {};

    page = !page ? 1 : parseInt(page);
    size = !size ? 20 : parseInt(size);

    if (page >= 1 && page <= 10 && size >= 1 && size <= 20) {
        pagination.limit = size;
        pagination.offset = size * (page - 1);
    }

    const where = {};
    const minLat = Number(req.query.minLat);
    const maxLat = Number(req.query.maxLat);
    const minLng = Number(req.query.minLng);
    const maxLng = Number(req.query.maxLng);
    const minPrice = Number(req.query.minPrice);
    const maxPrice = Number(req.query.maxPrice);

    if (minLat) {
        if (maxLat) {
            where.lat = {
                [Op.between]: [minLat, maxLat]
            };
        } else {
            where.lat = {
                [Op.between]: [minLat, 90]
            };
        }
    } else {
        await Spot.findAll();
    }

    if (req.query.maxLat) {
        if (minLat) {
            where.lat = {
                [Op.between]: [minLat, maxLat]
            };
        } else {
            where.lat = {
                [Op.between]: [-90, maxLat]
            };
        }
    } else {
        await Spot.findAll();
    }

    if (minLng) {
        if (maxLng) {
            where.lng = {
                [Op.between]: [minLng, maxLng]
            };
        } else {
            where.lng = {
                [Op.between]: [minLng, 180]
            };
        }
    } else {
        await Spot.findAll();
    }

    if (maxLng) {
        if (minLng) {
            where.lng = {
                [Op.between]: [minLng, maxLng]
            };
        } else {
            where.lng = {
                [Op.between]: [-180, maxLng]
            };
        }
    } else {
        await Spot.findAll();
    }

    if (minPrice) {
        if (maxPrice) {
            where.price = {
                [Op.between]: [minPrice, maxPrice]
            };
        } else {
            where.price = {
                [Op.gte]: minPrice
            };
        }
    } else {
        await Spot.findAll();
    }

    if (maxPrice) {
        if (minPrice) {
            where.price = {
                [Op.between]: [minPrice, maxPrice]
            };
        } else {
            where.price = {
                [Op.between]: [0, maxPrice]
            };
        }
    } else {
        await Spot.findAll();
    }

    const spots = await Spot.findAll({
        where,
        ...pagination,
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ],
    });
    const spotObj = {};
    const spotsList = [];

    spots.forEach(spot => {
        spotsList.push(spot.toJSON())
    });

    spotsList.forEach(spot => {
        spot.lat = Number(spot.lat);
        spot.lng = Number(spot.lng);
        spot.price = Number(spot.price);

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
    spotObj.page = page;
    spotObj.size = size;

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
        spot.lat = Number(spot.lat);
        spot.lng = Number(spot.lng);
        spot.price = Number(spot.price);

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

router.get('/:spotId/reviews', async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        return res.status(404).json({
            message: 'Spot couldn\'t be found'
        });
    }

    const spotReviews = await Review.findAll({
        where: {
            spotId: req.params.spotId
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    const reviewObj = {};
    const reviewsList = [];

    spotReviews.forEach(review => {
        reviewsList.push(review.toJSON())
    });

    reviewObj.Reviews = reviewsList;

    return res.json(reviewObj);
});

router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const { user } = req;
    const spot = await Spot.findByPk(req.params.spotId);

    let bookingObj = {};
    let bookingsList = [];

    if (!spot) {
        return res.status(404).json({
            message: 'Spot couldn\'t be found'
        });
    }

    if (user.id !== spot.ownerId) {
        const bookings = await Booking.findAll({
            where: {
                spotId: spot.id
            },
            attributes: ['spotId', 'startDate', 'endDate']
        });

        bookings.forEach(booking => {
            bookingsList.push(booking.toJSON())
        });

        bookingObj.Bookings = bookingsList;

        return res.json(bookingObj);
    } else {
        const bookings = await Booking.findAll({
            where: {
                spotId: spot.id
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                }
            ]
        });

        const bookingsArr = [];

        bookings.forEach(booking => {
            bookingsArr.push(booking.toJSON())
        });

        bookingsArr.forEach(booking => {
            const bookingRemix = {
                User: booking.User,
                id: booking.id,
                spotId: booking.spotId,
                userId: booking.userId,
                startDate: booking.startDate,
                endDate: booking.endDate,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt
            };
            bookingsList.push(bookingRemix);
        });

        bookingObj.Bookings = bookingsList;

        return res.json(bookingObj);
    }
});

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

router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
    const { user } = req;
    const { review, stars } = req.body;
    const errRes = {};
    const spot = await Spot.findByPk(req.params.spotId, {
        include: [
            {
                model: Review
            }
        ]
    });

    if (!spot) {
        return res.status(404).json({
            message: 'Spot couldn\'t be found'
        });
    }

    spot.Reviews.forEach(review => {
        if (review.userId === user.id) {
            errRes.message = 'User already has a review for this spot';
        }
    });

    if (Object.entries(errRes).length) {
        return res.status(500).json(errRes);
    }

    const newReview = await Review.create({
        userId: user.id,
        spotId: spot.id,
        review,
        stars
    });

    return res.json(newReview);
});

router.post('/:spotId/bookings', requireAuth, spotUnauthorize, validateBooking, noBookingAround, bookingConflictCheck, async (req, res, next) => {
    const { user } = req;
    const { startDate, endDate } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const errRes = { message: 'Sorry, this spot is already booked for the specified dates', errors: {} }
    const spot = await Spot.findByPk(req.params.spotId, {
        include: [
            {
                model: Booking
            }
        ]
    });

    spot.Bookings.forEach(booking => {
        const bookingStart = new Date(booking.startDate);
        const bookingEnd = new Date(booking.endDate);

        if (bookingStart >= start && bookingEnd <= end) {
            errRes.errors.startDate = 'Start date conflicts with an existing booking';
            errRes.errors.endDate = 'End date conflicts with an existing booking';
        }
    });

    if (Object.entries(errRes.errors).length) {
        return res.status(403).json(errRes);
    }

    const newBooking = await Booking.create({
        spotId: spot.id,
        userId: user.id,
        startDate: start,
        endDate: end
    });

    return res.json(newBooking);
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
