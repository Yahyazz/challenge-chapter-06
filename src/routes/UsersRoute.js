import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  Register,
  Login,
  Logout,
  getCurrentUser,
} from '../controllers/UsersController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { refreshToken } from '../controllers/refreshToken.js';

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users/create', createUser); // superadmin
router.put('/users/update/:id', updateUser); // superadmin
router.delete('/users/delete/:id', deleteUser); // superadmin
router.post('/register', Register); // member only
router.post('/login', Login); // member only
router.get('/token', refreshToken);
router.delete('/logout', Logout);
router.get('/whoami', verifyToken, getCurrentUser);

export default router;
