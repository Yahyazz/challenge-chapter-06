import jwt from 'jsonwebtoken';
import Users from '../models/UserModel.js';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.userId = decoded.userId;
    req.email = decoded.email;
    req.role = decoded.role;
    next();
  });
};

export const superAdminOnly = async (req, res, next) => {
  const user = await Users.findAll({
    where: {
      id: req.userId,
    },
  });
  if (!user[0]) return res.sendStatus(404);
  if (user[0].role !== 'superadmin') return res.status(403).json({ msg: 'You are not Authorized' });
  next();
};

export const adminOnly = async (req, res, next) => {
  const user = await Users.findAll({
    where: {
      id: req.userId,
    },
  });
  if (!user[0]) return res.sendStatus(404);
  if (user[0].role !== 'admin' || user.role !== 'superadmin')
    return res.status(403).json({ msg: 'You are not Authorized' });
  req.userId = user[0].id;
  req.email = user[0].email;
  req.role = user[0].role;
  next();
};
