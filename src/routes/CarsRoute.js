import express from 'express';
import {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  getHomePage,
  getCarsPage,
  getLoginPage,
  getDashboardPage,
} from '../controllers/CarsController.js';

const router = express.Router();

router.get('/', getHomePage);
router.get('/cars', getCarsPage);
router.get('/login', getLoginPage);
router.get('/dashboard', getDashboardPage);
router.get('/dashboard/cars', getAllCars);
router.get('/dashboard/detail-cars/:id', getCarById);
router.get('/dashboard/create-cars', createCar);
router.get('/dashboard/update-cars/:id', updateCar);

export default router;
