'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [3, 100],
        },
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          isEmail: true,
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      refresh_token: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  },
};
