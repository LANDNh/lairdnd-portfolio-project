const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, ReviewImage, User, Booking, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, handleBookingConflict } = require('../../utils/validation.js');
const { originAgentCluster } = require('helmet');

const router = express.Router();

const bookingAuthorize = async (req, res, next) => {
    const { user } = req;
    const booking = await Booking.findByPk(req.params.bookingId);

    if (!booking) {
        return res.status(404).json({
            message: 'Booking couldn\'t be found'
        });
    } else if (user.id !== booking.userId) {
        return res.status(403).json({
            message: 'Forbidden'
        });
    } else {
        next();
    }
};

const pastBookingEndCheck = async (req, res, next) => {
    const now = new Date();
    const booking = await Booking.findByPk(req.params.bookingId);
    const pastEnd = new Date(booking.endDate);

    if (pastEnd < now) {
        return res.status(403).json({
            message: 'Past bookings can\'t be modified'
        });
    } else {
        next();
    }
}

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
            const booking = await Booking.findByPk(req.params.bookingId);
            const spots = await Spot.findAll({
                where: {
                    id: booking.spotId
                },
                include: [
                    {
                        model: Booking
                    }
                ]
            });

            const spotsList = [];

            spots.forEach(spot => spotsList.push(spot.toJSON()));

            spotsList.forEach(spot => {
                spot.Bookings.forEach(booking => {
                    const bookingStart = new Date(booking.startDate);
                    const bookingEnd = new Date(booking.endDate);

                    if (newDate >= bookingStart && newDate <= bookingEnd) {
                        throw new Error('Start date conflicts with an existing booking')
                    }
                });
            });
        }),
    check('endDate')
        .custom(async (val, { req }) => {
            const newDate = new Date(val);
            const booking = await Booking.findByPk(req.params.bookingId);
            const spots = await Spot.findAll({
                where: {
                    id: booking.spotId
                },
                include: [
                    {
                        model: Booking
                    }
                ]
            });

            const spotsList = [];

            spots.forEach(spot => spotsList.push(spot.toJSON()));

            spotsList.forEach(spot => {
                spot.Bookings.forEach(booking => {
                    const bookingStart = new Date(booking.startDate);
                    const bookingEnd = new Date(booking.endDate);

                    if (newDate >= bookingStart && newDate <= bookingEnd) {
                        throw new Error('End date conflicts with an existing booking')
                    }
                });
            });
        }),
    handleBookingConflict
];

router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;

    const bookings = await Booking.findAll({
        where: {
            userId: user.id
        },
        include: [
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
        ]
    });

    const bookingObj = {};
    const bookingsArr = [];
    const bookingsList = [];

    bookings.forEach(booking => {
        bookingsArr.push(booking.toJSON())
    });

    bookingsArr.forEach(booking => {
        booking.Spot.lat = Number(booking.Spot.lat);
        booking.Spot.lng = Number(booking.Spot.lng);
        booking.Spot.price = Number(booking.Spot.price);

        booking.Spot.SpotImages.forEach(image => {
            if (image.preview === true) {
                booking.Spot.previewImage = image.url;
            }
        });
        delete booking.Spot.SpotImages;

        const bookingRemix = {
            id: booking.id,
            spotId: booking.spotId,
            Spot: booking.Spot,
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
});

router.put('/:bookingId', requireAuth, bookingAuthorize, validateBooking, pastBookingEndCheck, bookingConflictCheck, async (req, res, next) => {
    const { startDate, endDate } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const updatedBooking = await Booking.findByPk(req.params.bookingId);

    updatedBooking.set({
        startDate: start || updatedBooking.startDate,
        endDate: end || updatedBooking.endDate
    });

    await updatedBooking.save();

    return res.json(updatedBooking);
});

module.exports = router;
