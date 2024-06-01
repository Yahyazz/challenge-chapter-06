'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cars', {
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
      carType: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      rentPerDay: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      imgUrl: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      createdById: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdBy: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      updatedById: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      updatedBy: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      deletedById: {
        type: Sequelize.INTEGER,
      },
      deletedBy: {
        type: Sequelize.STRING,
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Cars');
  },
};
