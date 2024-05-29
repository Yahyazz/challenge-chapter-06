import express from 'express';
import { Register, Login, Logout, getCurrentUser } from '../controllers/Auth.js';
import { verifyToken } from '../middleware/AuthUser.js';

const router = express.Router();

router.post('/register', Register); // member only
router.post('/login', Login); // member only
router.delete('/logout', Logout);
router.get('/whoami', verifyToken, getCurrentUser);

export default router;
