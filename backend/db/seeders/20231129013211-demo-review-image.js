'use strict';

/** @type {import('sequelize-cli').Migration} */

const { ReviewImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: 'https://bar1.com'
      },
      {
        reviewId: 2,
        url: 'https://bar2.com'
      },
      {
        reviewId: 3,
        url: 'https://bar3.com'
      },
      {
        reviewId: 4,
        url: 'https://bar4.com'
      },
      {
        reviewId: 5,
        url: 'https://bar5.com'
      },
      {
        reviewId: 6,
        url: 'https://bar6.com'
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3, 4, 5, 6] }
    }, {});
  }
};
