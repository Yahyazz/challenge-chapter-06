import Cars from '../models/CarsModel.js';
import Users from '../models/UserModel.js';
import cloudinary from '../config/cloudinary.js';
import { Op } from 'sequelize';

export const getAllCarsApi = async (req, res) => {
  try {
    let response;
    if (req.role === 'superadmin') {
      response = await Cars.findAll({
        include: [
          {
            model: Users,
          },
        ],
      });
    } else if (req.role === 'admin') {
      response = await Cars.findAll({
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: Users,
          },
        ],
      });
    } else {
      response = await Cars.findAll({
        include: [
          {
            model: Users,
          },
        ],
      });
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
        include: [
          {
            model: Users,
          },
        ],
      });
    } else if (req.role === 'admin') {
      response = await Cars.findOne({
        where: {
          [Op.and]: [{ userId: req.userId }, { id: carData.id }],
        },
        include: [
          {
            model: Users,
          },
        ],
      });
    } else {
      response = await Cars.findOne({
        where: {
          id: carData.id,
        },
        include: [
          {
            model: Users,
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const createCarApi = async (req, res) => {
  if (req.role !== 'superadmin' && req.role !== 'admin')
    return res.status(403).json({ msg: 'You are not Authorized' });
  const fileBase64 = req.file.buffer.toString('base64');
  const file = `data:${req.file.mimetype};base64,${fileBase64}`;
  let imgUrl = '';
  const createdBy = req.userId;
  const updatedBy = req.userId;
  const isDeleted = false;
  const userId = req.userId;
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

  // console.log(req.body);
  // console.log(imgUrl);
  // console.log({ ...req.body, imgUrl, userId, createdBy });
  try {
    await Cars.create({ ...req.body, imgUrl, userId, createdBy, updatedBy, isDeleted });

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
    return res.status(403).json({ msg: 'You are not Authorized' });
  const isWithFile = req.file;
  console.log(isWithFile);
  const carData = await Cars.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!carData) return res.status(404).json({ msg: 'Car not found' });
  if (isWithFile) {
    const fileBase64 = req.file.buffer.toString('base64');
    const file = `data:${req.file.mimetype};base64,${fileBase64}`;
    let imgUrl = '';
    const updatedBy = req.userId;
    const userId = req.userId;

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
      if (req.role === 'superadmin') {
        await Cars.update(
          { ...req.body, imgUrl, userId, updatedBy },
          {
            where: {
              id: carData.id,
            },
          }
        );
      } else if (req.role === 'admin') {
        if (carData.userId !== req.userId)
          return res.status(403).json({ msg: 'You are not Authorized' });
        await Cars.update(
          { ...req.body, imgUrl, userId, updatedBy },
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
  } else {
    try {
      if (req.role === 'superadmin') {
        await Cars.update(
          { ...req.body, userId, updatedBy },
          {
            where: {
              id: carData.id,
            },
          }
        );
      } else if (req.role === 'admin') {
        if (carData.userId !== req.userId)
          return res.status(403).json({ msg: 'You are not Authorized' });
        await Cars.update(
          { ...req.body, userId, updatedBy },
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
    return res.status(403).json({ msg: 'You are not Authorized' });
  const carData = await Cars.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!carData) return res.status(404).json({ msg: 'Car not found' });
  const isDeleted = true;
  const deletedBy = req.userId;
  const userId = req.userId;
  try {
    if (req.role === 'superadmin') {
      await Cars.update(
        { ...req.body, deletedBy, isDeleted, userId },
        {
          where: {
            id: carData.id,
          },
        }
      );
    } else if (req.role === 'admin') {
      if (carData.userId !== req.userId)
        return res.status(403).json({ msg: 'You are not Authorized' });
      await Cars.update(
        { ...req.body, deletedBy, isDeleted, userId },
        {
          where: {
            [Op.and]: [{ userId: req.userId }, { id: carData.id }],
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
