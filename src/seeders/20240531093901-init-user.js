'use strict';

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

function hashPassword(password) {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
}

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      {
        uuid: uuidv4(),
        name: 'Jane Doe',
        email: 'jane@gmail.com',
        password: hashPassword('123456'),
        role: 'superadmin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
