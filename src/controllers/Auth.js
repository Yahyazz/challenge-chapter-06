import Users from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
    const role = user[0].role;

    const accessToken = jwt.sign({ userId, name, email, role }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '60s',
    });
    const refreshToken = jwt.sign({ userId, name, email, role }, process.env.REFRESH_TOKEN_SECRET, {
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
  if (!refreshToken) return res.sendStatus(401);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(404);
  res.json(user[0]);
};
