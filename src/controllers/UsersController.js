import Users from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ['uuid', 'name', 'email', 'role', 'refresh_token'],
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await Users.findAll({
      attributes: ['uuid', 'name', 'email', 'role', 'refresh_token'],
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json(user[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;
  const emailExist = await Users.findAll({
    where: {
      email: email,
    },
  });
  if (emailExist[0]) return res.status(400).json({ error: 'Email already exist' });

  if (password !== confPassword)
    return res.status(400).json({ error: 'Password and Confirm Password must be the same' });
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await Users.create({
      name: name,
      email: email,
      password: hashPassword,
      role: role,
    });
    res.status(201).json({
      msg: 'User Created Successfully',
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  const user = await Users.findAll({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user[0]) return res.status(404).json({ error: 'User not found' });
  const { name, email, password, confPassword, role } = req.body;
  let hashPassword;
  if (password === '' || password === null) {
    hashPassword = user[0].password;
  } else {
    const salt = await bcrypt.genSalt();
    hashPassword = await bcrypt.hash(password, salt);
  }
  if (password !== confPassword)
    return res.status(400).json({ error: 'Password and Confirm Password must be the same' });
  try {
    await Users.update(
      {
        name: name,
        email: email,
        password: hashPassword,
        role: role,
      },
      {
        where: {
          id: user[0].id,
        },
      }
    );
    res.status(201).json({
      msg: 'User Updated Successfully',
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  const user = await Users.findAll({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user[0]) return res.status(404).json({ error: 'User not found' });
  try {
    await Users.destroy({
      where: {
        id: user[0].id,
      },
    });
    res.status(201).json({
      msg: 'User Deleted Successfully',
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
