const Application = require('../models/Application');
const Offer = require('../models/Offer');
const ErrorResonse = require('../utils/errorResponse');

exports.createApplication = async (req, res, next) => {
  try {
    const offerId = req.params.offerId;
    req.body.offer = offerId;

    const offer = await Offer.findById(offerId);

    if (!offer) {
      return next(new ErrorResonse(`Not found offer with the id of ${offerId}`, 404));
    }

    const application = await Application.create(req.body);
    res.status(201).json({ success: true, data: application });
  } catch (err) {
    next(err);
  }
};
