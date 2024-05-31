import express from 'express';
import {
  getAllCarsApi,
  getCarByIdApi,
  createCarApi,
  updateCarApi,
  deleteCarApi,
} from '../../controllers/ApiCarsController.js';
import uploadOnMemory from '../../middleware/uploadOnMemory.js';
import { verifyToken } from '../../middleware/AuthUser.js';

const router = express.Router();

router.get('/api/cars', verifyToken, getAllCarsApi);
router.get('/api/cars/:id', verifyToken, getCarByIdApi);
router.post('/api/cars', verifyToken, uploadOnMemory.single('imgUrl'), createCarApi);
router.put('/api/cars/:id', verifyToken, uploadOnMemory.single('imgUrl'), updateCarApi);
router.put('/api/cars-delete/:id', verifyToken, deleteCarApi);

export default router;
