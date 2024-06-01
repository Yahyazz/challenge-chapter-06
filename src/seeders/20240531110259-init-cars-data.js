'use strict';

/** @type {import('sequelize-cli').Migration} */
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Cars', [
      {
        uuid: uuidv4(),
        name: 'Supra MK4',
        carType: 'Sport',
        rentPerDay: 1000000,
        imgUrl:
          'https://res.cloudinary.com/dwgdf6r40/image/upload/v1716991695/emo7hv2wcs7e9yja9jxn.jpg',
        createdById: 1,
        createdBy: 'Jane Doe',
        updatedById: 1,
        updatedBy: 'Jane Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        name: 'Nissan Skyline 34',
        carType: 'Sport',
        rentPerDay: 25000000,
        imgUrl:
          'https://res.cloudinary.com/dwgdf6r40/image/upload/v1716991695/emo7hv2wcs7e9yja9jxn.jpg',
        createdById: 1,
        createdBy: 'Jane Doe',
        updatedById: 1,
        updatedBy: 'Jane Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Cars', null, 'Jane Doe');
  },
};
