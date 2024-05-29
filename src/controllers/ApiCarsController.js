import Cars from '../models/CarsModel.js';
import cloudinary from '../config/cloudinary.js';

export const getAllCarsApi = async (req, res) => {
  try {
    const response = await Cars.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getCarByIdApi = async (req, res) => {
  try {
    const response = await Cars.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const createCarApi = async (req, res) => {
  const fileBase64 = req.file.buffer.toString('base64');
  const file = `data:${req.file.mimetype};base64,${fileBase64}`;
  let imgUrl = '';

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
  console.log({ ...req.body, imgUrl });
  try {
    await Cars.create({ ...req.body, imgUrl });
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
  const isWithFile = req.file;
  console.log(isWithFile);
  if (isWithFile) {
    const fileBase64 = req.file.buffer.toString('base64');
    const file = `data:${req.file.mimetype};base64,${fileBase64}`;
    let imgUrl = '';

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
      await Cars.update(
        { ...req.body, imgUrl },
        {
          where: {
            id: req.params.id,
          },
        }
      );
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
      await Cars.update(
        { ...req.body },
        {
          where: {
            id: req.params.id,
          },
        }
      );
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
  try {
    await Cars.destroy({
      where: {
        id: req.params.id,
      },
    });
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
