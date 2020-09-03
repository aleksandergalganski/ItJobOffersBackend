const express = require('express');
const {
  getCompany,
  getCompanies,
  createCompany,
  deleteCompany,
  updateCompany,
  uploadCompanyLogo
} = require('../controllers/companies');
const offersRouter = require('./offers');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use('/:companyId/offers', offersRouter);

router.route('/').get(getCompanies).post(protect, createCompany);

router
  .route('/:id')
  .get(getCompany)
  .put(protect, updateCompany)
  .delete(protect, deleteCompany);

router.route('/:id/logo').put(protect, uploadCompanyLogo);

module.exports = router;
