import express from 'express';
import {
  getAllCarsApi,
  getCarByIdApi,
  createCarApi,
  updateCarApi,
  deleteCarApi,
} from '../../controllers/ApiCarsController.js';
import uploadOnMemory from '../../middleware/uploadOnMemory.js';

const router = express.Router();

router.get('/api/cars', getAllCarsApi);
router.get('/api/cars/:id', getCarByIdApi);
router.post('/api/cars', uploadOnMemory.single('imgUrl'), createCarApi);
router.put('/api/cars/:id', uploadOnMemory.single('imgUrl'), updateCarApi);
router.delete('/api/cars/:id', deleteCarApi);

export default router;
