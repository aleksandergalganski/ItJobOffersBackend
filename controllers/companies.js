const path = require('path');
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

exports.uploadCompanyLogo = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);

    if (company) {
      if (req.files) {
        const file = req.files.file;

        if (file.mimetype.startsWith('image')) {
          if (file.size <= process.env.MAX_FILE_UPLOAD) {
            file.name = `logo_${company._id}${path.parse(file.name).ext}`;
            file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
              if (err) {
                next(new ErrorResponse('Problem with file upload', 500));
              } else {
                await Company.findOneAndUpdate(req.params.id, {
                  logo: file.name
                });
                res.status(200).json({ success: true, data: file.name });
              }
            });
          } else {
            next(
              new ErrorResponse(
                `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`
              )
            );
          }
        } else {
          next(new ErrorResponse('Please upload a valid image file', 400));
        }
      } else {
        next(new ErrorResponse('Please upload a file', 400));
      }
    } else {
      next(new ErrorResponse(`Company not found with the id of ${req.params.id}`, 404));
    }
  } catch (err) {
    next(err);
  }
};
