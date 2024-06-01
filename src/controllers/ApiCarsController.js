import Cars from '../models/cars.js';
import Users from '../models/user.js';
import cloudinary from '../config/cloudinary.js';
import { Op } from 'sequelize';

export const getAllCarsApi = async (req, res) => {
  try {
    let response;
    if (req.role === 'superadmin') {
      response = await Cars.findAll();
    } else if (req.role === 'admin') {
      response = await Cars.findAll({
        where: {
          createdById: req.userId,
        },
      });
    } else {
      response = await Cars.findAll();
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getCarByIdApi = async (req, res) => {
  try {
    const carData = await Cars.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!carData) return res.status(404).json({ msg: 'Car not found' });

    let response;
    if (req.role === 'superadmin') {
      response = await Cars.findOne({
        where: {
          id: carData.id,
        },
      });
    } else if (req.role === 'admin') {
      if (carData.createdById !== req.userId)
        return res
          .status(403)
          .json({
            msg: 'You are not Authorized. You can only view data that you create yourself.',
          });
      response = await Cars.findOne({
        where: {
          [Op.and]: [{ createdById: req.userId }, { id: carData.id }],
        },
      });
    } else {
      response = await Cars.findOne({
        where: {
          id: carData.id,
        },
      });
    }
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const createCarApi = async (req, res) => {
  if (req.role !== 'superadmin' && req.role !== 'admin')
    return res.status(403).json({ msg: 'You are not Authorized. You must be an admin.' });

  const fileBase64 = req.file.buffer.toString('base64');
  const file = `data:${req.file.mimetype};base64,${fileBase64}`;
  let imgUrl = '';

  const userData = await Users.findOne({
    attributes: ['id', 'uuid', 'name', 'email', 'role', 'refresh_token'],
    where: {
      id: req.userId,
    },
  });

  const createdById = req.userId;
  const createdBy = userData.name;
  const updatedById = req.userId;
  const updatedBy = userData.name;

  await cloudinary.uploader.upload(file, function (err, result) {
    if (!!err) {
      console.log(err);
      return res.status(400).json({
        message: 'Gagal upload file!',
      });
    }
    console.log(result.url);
    imgUrl = result.url;
  });

  try {
    await Cars.create({ ...req.body, imgUrl, createdById, createdBy, updatedById, updatedBy });

    req.session.message = {
      type: 'success',
      message: 'Car has been added successfully!',
    };
    res.status(201).json({ msg: 'Car Created' });
  } catch (error) {
    req.session.message = {
      type: 'danger',
      message: 'Can not add car!',
    };
    console.log(error.message);
  }
};

export const updateCarApi = async (req, res) => {
  if (req.role !== 'superadmin' && req.role !== 'admin')
    return res.status(403).json({ msg: 'You are not Authorized. You must be an admin.' });

  const isWithFile = req.file;

  const carData = await Cars.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!carData) return res.status(404).json({ msg: 'Car not found' });
  if (req.role === 'admin' && carData.createdById !== req.userId)
    return res
      .status(403)
      .json({ msg: 'You are not Authorized. You can only update data that you create yourself.' });
  if (carData.isDeleted)
    return res.json({ msg: 'You cannot update the data because the data has been deleted.' });

  const userData = await Users.findOne({
    attributes: ['id', 'uuid', 'name', 'email', 'role', 'refresh_token'],
    where: {
      id: req.userId,
    },
  });

  const updatedById = req.userId;
  const updatedBy = userData.name;

  if (isWithFile) {
    const fileBase64 = req.file.buffer.toString('base64');
    const file = `data:${req.file.mimetype};base64,${fileBase64}`;
    let imgUrl = '';

    await cloudinary.uploader.upload(file, function (err, result) {
      if (!!err) {
        console.log(err);
        return res.status(400).json({
          message: 'Can not upload file!',
        });
      }
      console.log(result.url);
      imgUrl = result.url;
    });

    try {
      if (req.role === 'superadmin') {
        await Cars.update(
          { ...req.body, imgUrl, updatedById, updatedBy },
          {
            where: {
              id: carData.id,
            },
          }
        );
      } else if (req.role === 'admin') {
        await Cars.update(
          { ...req.body, imgUrl, updatedById, updatedBy },
          {
            where: {
              [Op.and]: [{ createdById: req.userId }, { id: carData.id }],
            },
          }
        );
      }

      req.session.message = {
        type: 'success',
        message: 'Car has been updated successfully!',
      };
      res.status(200).json({ msg: 'Car Updated' });
    } catch (error) {
      req.session.message = {
        type: 'danger',
        message: 'Can not update car!',
      };
      console.log(error.message);
    }
  } else {
    try {
      if (req.role === 'superadmin') {
        await Cars.update(
          { ...req.body, updatedById, updatedBy },
          {
            where: {
              id: carData.id,
            },
          }
        );
      } else if (req.role === 'admin') {
        await Cars.update(
          { ...req.body, updatedById, updatedBy },
          {
            where: {
              [Op.and]: [{ userId: req.userId }, { id: carData.id }],
            },
          }
        );
      }

      req.session.message = {
        type: 'success',
        message: 'Car has been updated successfully!',
      };
      res.status(200).json({ msg: 'Car Updated' });
    } catch (error) {
      req.session.message = {
        type: 'danger',
        message: 'Can not update car!',
      };
      console.log(error.message);
    }
  }
};

export const deleteCarApi = async (req, res) => {
  if (req.role !== 'superadmin' && req.role !== 'admin')
    return res.status(403).json({ msg: 'You are not Authorized. You must be an admin.' });
  const carData = await Cars.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!carData) return res.status(404).json({ msg: 'Car not found' });

  const userData = await Users.findOne({
    attributes: ['id', 'uuid', 'name', 'email', 'role', 'refresh_token'],
    where: {
      id: req.userId,
    },
  });

  const isDeleted = true;
  const deletedById = req.userId;
  const deletedBy = userData.name;
  const deletedAt = new Date();

  try {
    if (req.role === 'superadmin') {
      await Cars.update(
        { ...req.body, deletedById, deletedBy, isDeleted, deletedAt },
        {
          where: {
            id: carData.id,
          },
        }
      );
    } else if (req.role === 'admin') {
      if (carData.createdById !== req.userId)
        return res.status(403).json({
          msg: 'You are not Authorized. You can only delete data that you create yourself.',
        });
      await Cars.update(
        { ...req.body, deletedById, deletedBy, isDeleted, deletedAt },
        {
          where: {
            [Op.and]: [{ createdById: req.userId }, { id: carData.id }],
          },
        }
      );
    }

    req.session.message = {
      type: 'success',
      message: 'Car has been deleted successfully!',
    };
    res.status(200).json({ msg: 'Car Deleted' });
  } catch (error) {
    req.session.message = {
      type: 'danger',
      message: 'Can not delete Car!',
    };
    console.log(error.message);
  }
};
