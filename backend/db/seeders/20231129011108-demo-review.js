'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 2,
        review: 'cool',
        stars: 4
      },
      {
        spotId: 1,
        userId: 3,
        review: 'perfect',
        stars: 5
      },
      {
        spotId: 2,
        userId: 3,
        review: 'meh',
        stars: 2
      },
      {
        spotId: 3,
        userId: 1,
        review: 'bad',
        stars: 1
      },
      {
        spotId: 4,
        userId: 3,
        review: 'neat',
        stars: 4
      },
      {
        spotId: 5,
        userId: 1,
        review: 'okay',
        stars: 3
      },
      {
        spotId: 6,
        userId: 2,
        review: 'awesome',
        stars: 5
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
