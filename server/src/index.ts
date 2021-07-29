import dotenv from 'dotenv';
dotenv.config({
  path: 'src/config/keys.env',
});

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import errorHandler from 'errorhandler';

// Middleware
const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(cookieParser());
app.use(compression());
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler());
  app.use(morgan('dev'));
}

// Database
import './core/database';

// Server
const PORT: number = Number(process.env.PORT);
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
