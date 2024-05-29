import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/UsersController.js';
import { verifyToken, superAdminOnly } from '../middleware/AuthUser.js';
import { refreshToken } from '../controllers/refreshToken.js';

const router = express.Router();

router.get('/users', verifyToken, superAdminOnly, getUsers);
router.get('/users/:id', verifyToken, superAdminOnly, getUserById);
router.post('/users/create', verifyToken, superAdminOnly, createUser); // superadmin
router.put('/users/update/:id', verifyToken, superAdminOnly, updateUser); // superadmin
router.delete('/users/delete/:id', verifyToken, superAdminOnly, deleteUser); // superadmin
router.get('/token', refreshToken);

export default router;
