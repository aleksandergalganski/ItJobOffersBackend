const express = require('express');
const {
  getCompany,
  getCompanies,
  createCompany,
  deleteCompany,
  updateCompany,
  deleteCompany
} = require('../controllers/companies');

const router = express.router();

router.route('/').get(getCompanies).post(createCompany);

router.route('/:id').get(getCompany).put(updateCompany).delete(deleteCompany);

module.exports = router;
