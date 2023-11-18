'use strict';

/** @type {import('sequelize-cli').Migration} */

const { User } = require('../models');
const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        firstName: 'Demo1',
        lastName: 'User1',
        email: 'demo1@user.io',
        username: 'Demo1',
        hashedPassword: bcrypt.hashSync('password1')
      },
      {
        firstName: 'Demo2',
        lastName: 'User2',
        email: 'demo2@user.io',
        username: 'Demo2',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Demo3',
        lastName: 'User3',
        email: 'demo3@user.io',
        username: 'Demo3',
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo1', 'Demo2', 'Demo3'] }
    }, {});
  }
};
