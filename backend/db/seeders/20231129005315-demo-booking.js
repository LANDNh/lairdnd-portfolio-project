'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 2,
        startDate: '2024-10-10',
        endDate: '2024-10-11'
      },
      {
        spotId: 2,
        userId: 3,
        startDate: '2024-10-11',
        endDate: '2024-10-12'
      },
      {
        spotId: 3,
        userId: 1,
        startDate: '2024-10-12',
        endDate: '2024-10-13'
      },
      {
        spotId: 4,
        userId: 3,
        startDate: '2024-10-13',
        endDate: '2024-10-14'
      },
      {
        spotId: 5,
        userId: 1,
        startDate: '2023-10-14',
        endDate: '2023-10-15'
      },
      {
        spotId: 6,
        userId: 2,
        startDate: '2024-10-15',
        endDate: '2024-10-16'
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
