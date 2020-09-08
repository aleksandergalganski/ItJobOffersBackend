const Offer = require('../models/Offer');
const Company = require('../models/Company');
const ErrorResponse = require('../utils/errorResponse');

exports.getOffers = async (req, res, next) => {
  try {
    if (req.params.companyId) {
      const offers = await Offer.find({ company: req.params.companyId });

      res.status(200).json({
        success: true,
        count: offers.length,
        data: offers
      });
    } else {
      const reqQuery = { ...req.query };
      const fieldsToRemove = ['select', 'sort', 'page', 'limit'];
      fieldsToRemove.forEach(param => delete reqQuery[param]);
      let queryStr = JSON.stringify(reqQuery);
      queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

      let query = Offer.find(JSON.parse(queryStr));

      // Select fields
      if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
      }

      // Sort
      if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
      } else {
        query = query.sort('-createdAt');
      }

      // Pagination
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 3;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const total = await Offer.countDocuments();

      query = query.skip(startIndex).limit(limit);

      const pagination = {};

      if (endIndex < total) {
        pagination.next = {
          page: page + 1,
          limit
        };
      }

      if (startIndex > 0) {
        pagination.prev = {
          page: page - 1,
          limit
        };
      }

      // Company name
      query = Offer.find().populate({
        path: 'company',
        select: 'name logo'
      });

      const offers = await query;

      res.status(200).json({
        success: true,
        count: offers.length,
        pagination,
        data: offers
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteOffers = async (req, res, next) => {
  try {
    await Offer.deleteMany({ company: req.params.companyId });
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(errr);
  }
};

exports.getOffer = async (req, res, next) => {
  try {
    const id = req.params.offerId;
    const offer = await Offer.findById(id);

    if (offer) {
      res.status(200).json({ success: true, data: offer });
    } else {
      next(new ErrorResponse(`No offer with the id of ${id}`, 404));
    }
  } catch (err) {
    next(err);
  }
};

exports.createOffer = async (req, res, next) => {
  const companyId = req.params.companyId;
  req.body.company = companyId;
  try {
    const company = await Company.findById(companyId);

    if (company) {
      const offer = await Offer.create(req.body);
      res.status(201).json({ success: true, data: offer });
    } else {
      next(new ErrorResponse(`No Company with the id of ${companyId}`));
    }
  } catch (err) {
    next(err);
  }
};

exports.updateOffer = async (req, res, next) => {
  const id = req.params.offerId;
  try {
    let offer = await Offer.findById(id);

    if (offer) {
      offer = await Offer.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
      });

      res.status(200).json({
        success: true,
        data: offer
      });
    } else {
      next(`No offer with the id of ${id}`);
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteOffer = async (req, res, next) => {
  const id = req.params.offerId;
  try {
    const offer = await Offer.findById(id);

    if (offer) {
      await Offer.remove();

      res.status(200).json({
        success: true,
        data: {}
      });
    } else {
      next(`No Offer with the id of ${offer}`);
    }
  } catch (err) {
    next(err);
  }
};
