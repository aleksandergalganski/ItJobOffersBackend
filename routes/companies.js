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

const router = express.Router();

router.use('/:companyId/offers', offersRouter);

router.route('/').get(getCompanies).post(createCompany);

router.route('/:id').get(getCompany).put(updateCompany).delete(deleteCompany);

router.route('/:id/logo').put(uploadCompanyLogo);

module.exports = router;
