const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Route files
const offers = require('./routes/offers');
const companies = require('./routes/companies');
const auth = require('./routes/auth');

// Load env variables
dotenv.config({ path: './config/config.env' });

// Connect to db
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(fileUpload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/companies', companies);
app.use('/api/v1/offers', offers);
app.use('/api/v1/auth', auth);

app.use(errorHandler);

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
