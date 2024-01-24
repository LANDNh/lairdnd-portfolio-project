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
        url: 'https://i.ibb.co/TB3RZ1d/helm-ext.jpg',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://i.ibb.co/n8GNTmT/helm-int1.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://i.ibb.co/xzzKwRV/helm-int2.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://i.ibb.co/QDkGx4Y/helm-int3.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://i.ibb.co/DRJxbDc/helm-int4.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://i.ibb.co/z4t3x45/kegs-ext.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://i.ibb.co/NK9C9cJ/kegs-int1.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://i.ibb.co/2tNf0B4/kegs-int2.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://i.ibb.co/2sF9pCG/kegs-int3.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://i.ibb.co/m9SgMkQ/kegs-int4.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://i.ibb.co/ySgnncF/driftwood-ext.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://i.ibb.co/WsFKwC4/driftwood-int1.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://i.ibb.co/QQkS161/driftwood-int2.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://i.ibb.co/1ZHTZZj/driftwood-int3.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://i.ibb.co/RPdXCQ4/driftwood-int4.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://i.ibb.co/M5rwDmL/leviathan-ext.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://i.ibb.co/tMgjbLf/leviathan-int1.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://i.ibb.co/5TRN2Z7/leviathan-int2.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://i.ibb.co/ZW26CBC/leviathan-int3.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://i.ibb.co/Tbyfkh5/leviathan-int4.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://i.ibb.co/QQR2Sxz/gallowgar-ext.jpg',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://i.ibb.co/SrLzYNc/gallowgar-int1.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://i.ibb.co/J5PCjWY/gallowgar-int2.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://i.ibb.co/pJ3Pf1k/gallowgar-int-3.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://i.ibb.co/XyYZ5wL/gallowgar-int-4.jpg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://i.ibb.co/2ddswhD/phontyr-ext.jpg',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://i.ibb.co/ZhNTMBm/phontyr-int1.jpg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://i.ibb.co/HVhbHG9/phontyr-int2.jpg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://i.ibb.co/hDBHsNX/phontry-int3.jpg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://i.ibb.co/5x59fmy/phontyr-int4.jpg',
        preview: false
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
