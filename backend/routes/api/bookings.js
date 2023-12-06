const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, ReviewImage, User, Booking, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js');
const { originAgentCluster } = require('helmet');

const router = express.Router();

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

module.exports = router;
