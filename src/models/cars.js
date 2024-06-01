import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const { DataTypes } = Sequelize;

const Cars = db.define(
  'cars',
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
    },
    carType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    rentPerDay: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    imgUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    createdById: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    updatedById: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deletedById: {
      type: DataTypes.INTEGER,
    },
    deletedBy: {
      type: DataTypes.STRING,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Cars;
