const Offer = require('../models/Offer');
const Company = require('../models/Company');
const ErrorResponse = require('../utils/errorResponse');

exports.getOffers = async (req, res, next) => {
  try {
    let query;
    if (req.params.companyId) {
      query = Offer.find({ company: req.params.companyId });
    } else {
      query = Offer.find();
    }

    const offers = await query;
    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers
    });
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
