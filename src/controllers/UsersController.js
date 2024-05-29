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

export const Login = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });
    const matchPassword = await bcrypt.compare(req.body.password, user[0].password);
    if (!matchPassword) return res.status(400).json({ error: 'Invalid Password' });
    const userId = user[0].id;
    const name = user[0].name;
    const email = user[0].email;

    const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '60s',
    });
    const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1d',
    });

    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken: accessToken });
  } catch (err) {
    res.status(404).json("Email doesn't exist");
  }
};

export const Register = async (req, res) => {
  const { name, email, password, confPassword } = req.body;
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
      role: 'member',
    });
    res.status(201).json({
      msg: 'Register Success',
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  await Users.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie('refreshToken');
  return res.sendStatus(200);
};

export const getCurrentUser = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  res.json(user[0]);
};
