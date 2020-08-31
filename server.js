const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');

dotenv.config({ path: './config/config/env' });

// connectDB();

const offers = require('./routes/offers');
const companies = require('./routes/companies');

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const server = app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server
  server.close(() => process.exit(1));
});
