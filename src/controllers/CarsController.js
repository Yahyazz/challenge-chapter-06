export const getHomePage = (req, res) => {
  res.render('landingPage', { title: 'Home' });
};

export const getCarsPage = (req, res) => {
  res.render('cars', { title: 'Booking Car' });
};

export const getLoginPage = (req, res) => {
  res.render('loginAdmin', { title: 'Login' });
};

export const getDashboardPage = (req, res) => {
  res.render('dashboard', { title: 'Dashboard' });
};

export const getAllCars = async (req, res) => {
  try {
    const data = await fetch('http://localhost:8000/api/cars');
    const cars = await data.json();
    res.render('carsDashboard', { title: 'List of Cars', cars: cars });
  } catch (err) {
    console.log(err);
  }
};

export const getCarById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await fetch(`http://localhost:8000/api/cars/${id}`);
    const car = await data.json();
    res.render('detailCar', { title: 'Car Detail', car: car });
  } catch (err) {
    console.log(err);
  }
};

export const createCar = (req, res) => {
  try {
    res.render('addCar', { title: 'Add Car' });
  } catch (err) {
    console.log(err);
  }
};

export const updateCar = async (req, res) => {
  const id = req.params.id;
  const data = await fetch(`http://localhost:8000/api/cars/${id}`);
  const car = await data.json();
  try {
    res.render('updateCar', { title: 'Update Car', car: car });
  } catch (err) {
    console.log(err);
  }
};
