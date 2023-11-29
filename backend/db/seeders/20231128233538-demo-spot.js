'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '123 Windspell Street',
        city: 'Baldur\'s Gate',
        state: 'Sword Coast',
        country: 'Western Heartlands',
        lat: 46.12345,
        lng: -83.23456,
        name: 'Helm and Cloak',
        description: 'The Helm and Cloak is a high-end inn, rooming house, and feasting hall in the city of Baldur\'s Gate.',
        price: 250
      },
      {
        ownerId: 1,
        address: '234 Temples District',
        city: 'Baldur\'s Gate',
        state: 'Sword Coast',
        country: 'Western Heartlands',
        lat: 46.12345,
        lng: -83.23456,
        name: 'Three Old Kegs',
        description: 'The Three Old Kegs is a well-known inn widely regarded as one of the best inns in all of Faerûn.',
        price: 5
      },
      {
        ownerId: 2,
        address: '123 Blacklake District',
        city: 'Neverwinter',
        state: 'Sword Coast',
        country: 'North-West Faerûn',
        lat: 71.12345,
        lng: -93.23456,
        name: 'Driftwood Tavern',
        description: 'The Driftwood Tavern is a fine inn and tavern, which also doubles as a museum.',
        price: 123
      },
      {
        ownerId: 2,
        address: '234 Blacklake District',
        city: 'Neverwinter',
        state: 'Sword Coast',
        country: 'North-West Faerûn',
        lat: 71.12345,
        lng: -93.23456,
        name: 'Beached Leviathan',
        description: 'The Beached Leviathan is a three-decked inn and tavern built in and around the refurbished wreckage of the pirate ship Leviathan.',
        price: 82
      },
      {
        ownerId: 3,
        address: '123 Dock District',
        city: 'Elturel',
        state: 'Elturgard',
        country: 'Western Heartlands',
        lat: 47.12345,
        lng: -77.23456,
        name: 'Gallowgar\'s Inn',
        description: 'Gallowgar\'s Inn, nicknamed the Manure Pile to some, is an inn in the city of Elturel.',
        price: 54
      },
      {
        ownerId: 3,
        address: '234 Dock District',
        city: 'Elturel',
        state: 'Elturgard',
        country: 'Western Heartlands',
        lat: 47.12345,
        lng: -77.23456,
        name: 'Phontyr\'s Unicorn',
        description: 'This locale has long been known for the mysterious apparition of a unicorn.',
        price: 160
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
