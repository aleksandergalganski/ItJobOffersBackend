const Company = require('../models/Company');
const ErrorResponse = require('../utils/errorResponse');

exports.getCompanies = async (req, res, next) => {
  const companies = await Company.find();
  res.status(200).json({
    success: true,
    count: companies.length,
    data: companies
  });
};

exports.getCompany = async (req, res, next) => {
  try {
    const id = req.params.id;
    const company = await Company.findById(id);

    if (company) {
      res.status(200).json({ success: true, data: company });
    } else {
      next(new ErrorResponse(`Company not found with the id of ${id}`, 404));
    }
  } catch (err) {
    next(err);
  }
};

exports.createCompany = async (req, res, next) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json({ success: true, data: company });
  } catch (err) {
    next(err);
  }
};

exports.updateCompany = async (req, res, next) => {
  try {
    const id = req.params.id;
    const company = await Company.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (company) {
      res.status(200).json({ success: true, data: company });
    } else {
      next(new ErrorResponse(`Company not found with the id of ${id}`, 404));
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteCompany = async (req, res, next) => {
  try {
    const id = req.params.id;
    const company = await Company.findById(id);

    if (company) {
      await company.remove();
      res.status(200).json({ success: true, data: {} });
    } else {
      next(new ErrorResponse(`Company not found with the id of ${id}`, 404));
    }
  } catch (err) {
    next(err);
  }
};
