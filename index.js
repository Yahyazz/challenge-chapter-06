import express from 'express';
import cors from 'cors';
import db from './src/config/Database.js';
import Cars from './src/models/cars.js';
import Users from './src/models/user.js';
import ApiCarsRoute from './src/routes/api/ApiCarsRoute.js';
import CarsRoute from './src/routes/CarsRoute.js';
import UsersRoute from './src/routes/UsersRoute.js';
import AuthRoute from './src/routes/AuthRoute.js';
import session from 'express-session';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

try {
  await db.authenticate();
  await Users.sync();
  await Cars.sync();
} catch (err) {
  console.error('Database connection failed:', err);
}

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static('./src/public'));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

app.use(ApiCarsRoute);
app.use(CarsRoute);
app.use(UsersRoute);
app.use(AuthRoute);

app.set('view engine', 'ejs');

app.listen(process.env.APP_PORT, () =>
  console.log(`Server is running on https://localhost:${process.env.APP_PORT}`)
);
