'use strict';

/** @type {import('sequelize-cli').Migration} */

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'https://foo1.com',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://foo2.com',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://foo3.com',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://foo4.com',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://foo5.com',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://foo6.com',
        preview: true
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5, 6] }
    }, {});
  }
};
