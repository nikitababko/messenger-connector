require('dotenv').config({
  path: 'src/config/keys.env',
});

// Modules
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');

// Custom modules
const connectToDB = require('./core/database');
const createRoutes = require('./core/routes');

// Setup app
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(compression());
app.use(helmet.xssFilter());
app.use(helmet.noSniff());

// Register routes
createRoutes(app);

// Connect to DB
connectToDB();

// Setup server
const PORT = process.env.PORT;
app.listen(PORT, (error) => {
  if (error) throw Error(error);
  console.log(`Server has started on port: ${PORT}`);
});
